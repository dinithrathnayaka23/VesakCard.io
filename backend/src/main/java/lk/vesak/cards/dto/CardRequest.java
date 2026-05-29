package lk.vesak.cards.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CardRequest(
        @NotBlank
        @Size(max = 100)
        String senderName,

        @Size(max = 100)
        String recipientName,

        @NotBlank
        @Size(min = 10, max = 500)
        String wishText,

        @Pattern(regexp = "lotus_night|temple_dawn|lantern_sky|forest_stream")
        String theme,

        @Pattern(regexp = "traditional_1|lotus_border|dharma_border|simple_gold")
        String borderStyle,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$")
        String accentColor,

        @Pattern(regexp = "lanterns_petals|fireflies|lotus_bloom|full")
        String animationSet
) {
}
