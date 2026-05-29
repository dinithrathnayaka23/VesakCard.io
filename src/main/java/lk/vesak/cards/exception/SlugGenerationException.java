package lk.vesak.cards.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class SlugGenerationException extends RuntimeException {

    public SlugGenerationException() {
        super("Unable to generate a unique card slug");
    }
}
