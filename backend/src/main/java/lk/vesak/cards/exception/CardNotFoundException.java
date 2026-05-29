package lk.vesak.cards.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class CardNotFoundException extends RuntimeException {

    private final String slug;

    public CardNotFoundException(String slug) {
        super("Card not found for slug: " + slug);
        this.slug = slug;
    }

    public String getSlug() {
        return slug;
    }
}
