package lk.vesak.cards.service;

import lk.vesak.cards.dto.CardRequest;
import lk.vesak.cards.dto.CardResponse;
import lk.vesak.cards.dto.CreateCardResponse;
import lk.vesak.cards.entity.CardEntity;
import lk.vesak.cards.exception.CardNotFoundException;
import lk.vesak.cards.repository.CardRepository;
import lk.vesak.cards.util.SlugGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final SlugGenerator slugGenerator;
    private final CacheManager cacheManager;
    private final CardViewCountService cardViewCountService;

    @Value("${app.share-base-url:http://localhost:3000}")
    private String shareBaseUrl;

    @Transactional
    public CreateCardResponse createCard(CardRequest request) {
        String slug = slugGenerator.generateUniqueSlug();

        CardEntity card = CardEntity.builder()
                .slug(slug)
                .senderName(request.senderName().trim())
                .recipientName(optionalTrim(request.recipientName()))
                .wishText(request.wishText().trim())
                .theme(valueOrDefault(request.theme(), "lotus_night"))
                .borderStyle(valueOrDefault(request.borderStyle(), "traditional_1"))
                .accentColor(valueOrDefault(request.accentColor(), "#D4AF37"))
                .animationSet(valueOrDefault(request.animationSet(), "lanterns_petals"))
                .build();

        CardEntity saved = cardRepository.save(card);
        evictCardCache(saved.getSlug());
        return new CreateCardResponse(saved.getSlug(), shareUrl(saved.getSlug()));
    }

    @Cacheable(value = "cards", key = "#slug", unless = "#result == null")
    @Transactional(readOnly = true)
    public CardResponse getCardBySlug(String slug) {
        CardResponse response = cardRepository.findBySlug(slug)
                .map(CardResponse::fromEntity)
                .orElseThrow(() -> new CardNotFoundException(slug));
        cardViewCountService.incrementViewCount(slug);
        return response;
    }

    private void evictCardCache(String slug) {
        Cache cardsCache = cacheManager.getCache("cards");
        if (cardsCache != null) {
            cardsCache.evict(slug);
        }
    }

    private String shareUrl(String slug) {
        return shareBaseUrl.replaceAll("/+$", "") + "/card/" + slug;
    }

    private String optionalTrim(String value) {
        return value == null ? "" : value.trim();
    }

    private String valueOrDefault(String value, String defaultValue) {
        return StringUtils.hasText(value) ? value.trim() : defaultValue;
    }
}
