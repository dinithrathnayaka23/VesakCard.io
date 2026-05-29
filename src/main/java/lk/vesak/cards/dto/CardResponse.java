package lk.vesak.cards.dto;

import lk.vesak.cards.entity.CardEntity;

import java.io.Serializable;
import java.time.Instant;

public record CardResponse(
        String slug,
        String senderName,
        String recipientName,
        String wishText,
        String theme,
        String borderStyle,
        String accentColor,
        String animationSet,
        Integer viewCount,
        Instant createdAt
) implements Serializable {
    public static CardResponse fromEntity(CardEntity card) {
        return new CardResponse(
                card.getSlug(),
                card.getSenderName(),
                card.getRecipientName(),
                card.getWishText(),
                card.getTheme(),
                card.getBorderStyle(),
                card.getAccentColor(),
                card.getAnimationSet(),
                card.getViewCount(),
                card.getCreatedAt()
        );
    }
}
