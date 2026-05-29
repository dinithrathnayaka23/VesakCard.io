package lk.vesak.cards.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lk.vesak.cards.dto.CardRequest;
import lk.vesak.cards.dto.CardResponse;
import lk.vesak.cards.dto.CreateCardResponse;
import lk.vesak.cards.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cards")
@Validated
@RequiredArgsConstructor
public class CardController {

    private static final String SLUG_PATTERN = "^[23456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz]{8}$";

    private final CardService cardService;

    @PostMapping
    public ResponseEntity<CreateCardResponse> createCard(@Valid @RequestBody CardRequest request) {
        CreateCardResponse response = cardService.createCard(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CardResponse> getCard(
            @PathVariable @Pattern(regexp = SLUG_PATTERN) String slug
    ) {
        return ResponseEntity.ok(cardService.getCardBySlug(slug));
    }
}
