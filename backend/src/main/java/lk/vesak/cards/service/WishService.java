package lk.vesak.cards.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lk.vesak.cards.dto.WishResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

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
@Slf4j
public class WishService {

    private static final String ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
    private static final String GEMINI_GENERATE_CONTENT_URL = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";
    private static final Duration WISH_CACHE_TTL = Duration.ofHours(24);
    private static final String SYSTEM_PROMPT = """
            You are a Sri Lankan Buddhist greeting writer fluent in natural Sinhala script and English.
            Generate a heartfelt Vesak Poya greeting for a shareable digital Vesak card.
            Respond ONLY with a valid JSON object, no markdown, no explanation.
            Format: {"sinhala": "...", "english": "..."}
            The sinhala field must be written in Sinhala script with correct casual Sinhala grammar.
            Keep the wish warm, respectful, and easy for Sri Lankan families to understand.
            Do not write romanized Sinhala. Avoid overly classical or difficult Sinhala.
            Mention තෙරුවන් සරණයි, කරුණාව, සාමය, ධර්මය, or පින්බර වෙසක් naturally.
            Address the recipient by name if provided.
            Sinhala wish length: 2-3 sentences. English wish: graceful translation of the Sinhala.
            """;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final StringRedisTemplate stringRedisTemplate;

    @Value("${app.ai.provider-order}")
    private String aiProviderOrder;

    @Value("${app.gemini.api-key}")
    private String geminiApiKey;

    @Value("${app.gemini.model}")
    private String geminiModel;

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

        WishResponse generatedWish = generateFreshWish(normalizedRecipientName, normalizedTone);
        cacheWish(cacheKey, generatedWish);
        return generatedWish;
    }

    private WishResponse generateFreshWish(String recipientName, String tone) {
        for (String provider : configuredProviders()) {
            if (!isProviderConfigured(provider)) {
                log.debug("Wish provider '{}' is not configured, skipping", provider);
                continue;
            }

            try {
                return switch (provider) {
                    case "gemini" -> callGemini(recipientName, tone);
                    case "anthropic" -> callAnthropic(recipientName, tone);
                    case "local" -> buildLocalWish(recipientName, tone);
                    default -> throw new IllegalStateException("Unknown AI provider: " + provider);
                };
            } catch (Exception exception) {
                log.warn("Wish provider '{}' failed, trying next fallback", provider, exception);
            }
        }

        return buildLocalWish(recipientName, tone);
    }

    private boolean isProviderConfigured(String provider) {
        return switch (provider) {
            case "gemini" -> StringUtils.hasText(geminiApiKey);
            case "anthropic" -> StringUtils.hasText(anthropicApiKey);
            case "local" -> true;
            default -> true;
        };
    }

    private WishResponse callGemini(String recipientName, String tone) {
        if (!StringUtils.hasText(geminiApiKey)) {
            throw new IllegalStateException("GEMINI_API_KEY is not configured");
        }

        String url = GEMINI_GENERATE_CONTENT_URL.formatted(
                UriUtils.encodePathSegment(geminiModel, StandardCharsets.UTF_8),
                UriUtils.encodeQueryParam(geminiApiKey, StandardCharsets.UTF_8)
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "systemInstruction", Map.of(
                        "parts", List.of(Map.of("text", SYSTEM_PROMPT))
                ),
                "contents", List.of(Map.of(
                        "role", "user",
                        "parts", List.of(Map.of(
                                "text", "Generate wish for: name=[" + recipientName + "], tone=[" + tone + "]"
                        ))
                )),
                "generationConfig", Map.of(
                        "maxOutputTokens", 300,
                        "responseMimeType", "application/json"
                )
        );

        ResponseEntity<String> response = restTemplate.postForEntity(
                url,
                new HttpEntity<>(body, headers),
                String.class
        );

        return parseGeminiResponse(response.getBody());
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

    private WishResponse parseGeminiResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            if (textNode.isMissingNode() || !StringUtils.hasText(textNode.asText())) {
                throw new IllegalStateException("Gemini response did not include text content");
            }
            return parseWishJson(textNode.asText(), "Gemini");
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to parse Gemini wish response", exception);
        }
    }

    private WishResponse parseAnthropicResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode textNode = root.path("content").path(0).path("text");
            if (textNode.isMissingNode() || !StringUtils.hasText(textNode.asText())) {
                throw new IllegalStateException("Anthropic response did not include text content");
            }
            return parseWishJson(textNode.asText(), "Anthropic");
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to parse Anthropic wish response", exception);
        }
    }

    private WishResponse parseWishJson(String text, String providerName) {
        try {
            return objectMapper.readValue(extractJsonObject(text), WishResponse.class);
        } catch (Exception exception) {
            throw new IllegalStateException(providerName + " returned invalid wish JSON", exception);
        }
    }

    private String extractJsonObject(String text) {
        String trimmed = text == null ? "" : text.trim();
        if (trimmed.startsWith("```")) {
            trimmed = trimmed.replaceFirst("^```[a-zA-Z]*\\s*", "").replaceFirst("\\s*```$", "").trim();
        }

        int start = trimmed.indexOf('{');
        int end = trimmed.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return trimmed.substring(start, end + 1);
        }

        return trimmed;
    }

    private WishResponse buildLocalWish(String recipientName, String tone) {
        String target = StringUtils.hasText(recipientName) ? recipientName : "ඔබට";

        return switch (tone) {
            case "formal" -> new WishResponse(
                    "සුභ වෙසක් පොහොය දිනයක් වේවා, " + target + ". තෙරුවන් සරණින් ඔබටත් ඔබේ පවුලේ සැමටත් ධර්මයේ ආලෝකය, කරුණාව සහ සාමය ලැබේවා.",
                    "Wishing you a blessed Vesak Poya. May the Triple Gem guide you and your family with the light of Dhamma, compassion, and peace."
            );
            case "friendly" -> new WishResponse(
                    "සුභ වෙසක් වේවා, " + target + "! මේ පින්බර දිනයේ ඔබේ සිතට සාමය, කරුණාව සහ සතුට පිරී ඉතිරේවා.",
                    "Happy Vesak! May this blessed day fill your heart with peace, compassion, and joy."
            );
            default -> new WishResponse(
                    "සුභ වෙසක් වේවා, " + target + ". තෙරුවන් සරණයි. ධර්මයේ ආලෝකයෙන් ඔබේ ජීවිතයට කරුණාව, සාමය සහ පින්බර සතුට ලැබේවා.",
                    "Wishing you a blessed Vesak. May the Triple Gem and the light of Dhamma bring compassion, peace, and gentle joy to your life."
            );
        };
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

    private List<String> configuredProviders() {
        if (!StringUtils.hasText(aiProviderOrder)) {
            return List.of("gemini", "anthropic", "local");
        }

        return List.of(aiProviderOrder.split(","))
                .stream()
                .map(provider -> provider.trim().toLowerCase(Locale.ROOT))
                .filter(StringUtils::hasText)
                .toList();
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
