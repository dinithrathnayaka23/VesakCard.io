package lk.vesak.cards.dto;

import java.io.Serializable;

public record CreateCardResponse(
        String slug,
        String shareUrl
) implements Serializable {
}
