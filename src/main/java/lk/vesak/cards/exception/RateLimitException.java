package lk.vesak.cards.exception;

public class RateLimitException extends RuntimeException {

    public RateLimitException() {
        super("Rate limit exceeded");
    }
}
