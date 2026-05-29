package lk.vesak.cards.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record WishRequest(
        @Size(max = 100)
        String recipientName,

        @Pattern(regexp = "formal|friendly|devotional")
        String tone
) {
}
