package lk.vesak.cards.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lk.vesak.cards.dto.WishResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WishService {

    private static final String ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
    private static final Duration WISH_CACHE_TTL = Duration.ofHours(24);
    private static final String SYSTEM_PROMPT = """
            You are a Buddhist scholar fluent in Sinhala and English.
            Generate a heartfelt Vesak Poya greeting.
            Respond ONLY with a valid JSON object, no markdown, no explanation.
            Format: {"sinhala": "...", "english": "..."}
            Sinhala wish: 2-3 sentences. Use respectful language.
            Reference ත්‍රිවිධ රත්නය (Triple Gem), කරුණාව (compassion),
            සාමය (peace), ධර්මය (Dhamma). Address recipient by name if provided.
            English wish: graceful translation of the Sinhala.
            """;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final StringRedisTemplate stringRedisTemplate;

    @Value("${app.anthropic.api-key}")
    private String anthropicApiKey;

    @Value("${app.anthropic.model}")
    private String anthropicModel;

    public WishResponse generateWish(String recipientName, String tone) {
        String normalizedRecipientName = normalizeRecipientName(recipientName);
        String normalizedTone = normalizeTone(tone);
        String cacheKey = "wishes::" + md5(normalizedRecipientName.toLowerCase(Locale.ROOT) + ":" + normalizedTone);

        WishResponse cachedWish = readCachedWish(cacheKey);
        if (cachedWish != null) {
            return cachedWish;
        }

        WishResponse generatedWish = callAnthropic(normalizedRecipientName, normalizedTone);
        cacheWish(cacheKey, generatedWish);
        return generatedWish;
    }

    private WishResponse callAnthropic(String recipientName, String tone) {
        if (!StringUtils.hasText(anthropicApiKey)) {
            throw new IllegalStateException("ANTHROPIC_API_KEY is not configured");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", anthropicApiKey);
        headers.set("anthropic-version", "2023-06-01");

        Map<String, Object> body = Map.of(
                "model", anthropicModel,
                "max_tokens", 300,
                "system", SYSTEM_PROMPT,
                "messages", List.of(Map.of(
                        "role", "user",
                        "content", "Generate wish for: name=[" + recipientName + "], tone=[" + tone + "]"
                ))
        );

        ResponseEntity<String> response = restTemplate.postForEntity(
                ANTHROPIC_MESSAGES_URL,
                new HttpEntity<>(body, headers),
                String.class
        );

        return parseAnthropicResponse(response.getBody());
    }

    private WishResponse parseAnthropicResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode textNode = root.path("content").path(0).path("text");
            if (textNode.isMissingNode() || !StringUtils.hasText(textNode.asText())) {
                throw new IllegalStateException("Anthropic response did not include text content");
            }
            return objectMapper.readValue(textNode.asText().trim(), WishResponse.class);
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to parse Anthropic wish response", exception);
        }
    }

    private WishResponse readCachedWish(String cacheKey) {
        try {
            String cachedJson = stringRedisTemplate.opsForValue().get(cacheKey);
            if (!StringUtils.hasText(cachedJson)) {
                return null;
            }
            return objectMapper.readValue(cachedJson, WishResponse.class);
        } catch (Exception ignored) {
            return null;
        }
    }

    private void cacheWish(String cacheKey, WishResponse wishResponse) {
        try {
            String wishJson = objectMapper.writeValueAsString(wishResponse);
            stringRedisTemplate.opsForValue().set(cacheKey, wishJson, WISH_CACHE_TTL);
        } catch (Exception ignored) {
            // Wish generation should still succeed when Redis is temporarily unavailable.
        }
    }

    private String normalizeRecipientName(String recipientName) {
        return recipientName == null ? "" : recipientName.trim();
    }

    private String normalizeTone(String tone) {
        return StringUtils.hasText(tone) ? tone.trim().toLowerCase(Locale.ROOT) : "devotional";
    }

    private String md5(String value) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("MD5");
            byte[] digest = messageDigest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("MD5 digest is unavailable", exception);
        }
    }
}
