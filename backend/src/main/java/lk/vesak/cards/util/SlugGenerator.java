package lk.vesak.cards.util;

import lk.vesak.cards.exception.SlugGenerationException;
import lk.vesak.cards.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
@RequiredArgsConstructor
public class SlugGenerator {

    private static final String ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final CardRepository cardRepository;

    @Value("${app.slug.length:8}")
    private int slugLength;

    @Value("${app.slug.max-retries:3}")
    private int maxRetries;

    public String generateUniqueSlug() {
        for (int attempt = 0; attempt < maxRetries; attempt++) {
            String slug = randomSlug();
            if (!cardRepository.existsBySlug(slug)) {
                return slug;
            }
        }

        throw new SlugGenerationException();
    }

    private String randomSlug() {
        StringBuilder slug = new StringBuilder(slugLength);
        for (int i = 0; i < slugLength; i++) {
            int index = SECURE_RANDOM.nextInt(ALPHABET.length());
            slug.append(ALPHABET.charAt(index));
        }
        return slug.toString();
    }
}
