package lk.vesak.cards.controller;

import jakarta.validation.Valid;
import lk.vesak.cards.dto.WishRequest;
import lk.vesak.cards.dto.WishResponse;
import lk.vesak.cards.service.WishService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/wishes")
@Validated
@RequiredArgsConstructor
public class WishController {

    private final WishService wishService;

    @PostMapping
    public ResponseEntity<WishResponse> generateWish(@Valid @RequestBody WishRequest request) {
        WishResponse response = wishService.generateWish(request.recipientName(), request.tone());
        return ResponseEntity.ok(response);
    }
}
