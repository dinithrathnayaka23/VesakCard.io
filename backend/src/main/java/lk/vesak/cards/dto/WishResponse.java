package lk.vesak.cards.dto;

import java.io.Serializable;

public record WishResponse(
        String sinhala,
        String english
) implements Serializable {
}
