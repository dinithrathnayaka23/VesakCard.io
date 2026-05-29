package lk.vesak.cards.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CardNotFoundException.class)
    public ResponseEntity<CardNotFoundError> handleCardNotFound(CardNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new CardNotFoundError("කාඩ්පත හමු නොවීය", exception.getSlug()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException exception) {
        List<ValidationFieldError> fields = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::toValidationFieldError)
                .toList();

        return ResponseEntity.badRequest()
                .body(new ValidationErrorResponse("ඇතුළත් කළ දත්ත වලංගු නොවේ", fields));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ValidationErrorResponse> handleConstraintViolation(ConstraintViolationException exception) {
        List<ValidationFieldError> fields = exception.getConstraintViolations()
                .stream()
                .map(violation -> new ValidationFieldError(
                        violation.getPropertyPath().toString(),
                        violation.getMessage()
                ))
                .toList();

        return ResponseEntity.badRequest()
                .body(new ValidationErrorResponse("ඇතුළත් කළ දත්ත වලංගු නොවේ", fields));
    }

    @ExceptionHandler(SlugGenerationException.class)
    public ResponseEntity<ErrorResponse> handleSlugGeneration() {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("කාඩ්පත සෑදීම අසාර්ථක විය"));
    }

    @ExceptionHandler(RateLimitException.class)
    public ResponseEntity<ErrorResponse> handleRateLimit() {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(new ErrorResponse("ඉල්ලීම් සීමාව ඉක්මවා ඇත. පසුව උත්සාහ කරන්න."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException() {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("සේවාදායක දෝෂයකි"));
    }

    private ValidationFieldError toValidationFieldError(FieldError fieldError) {
        return new ValidationFieldError(fieldError.getField(), fieldError.getDefaultMessage());
    }

    public record ErrorResponse(String error) {
    }

    public record CardNotFoundError(String error, String slug) {
    }

    public record ValidationErrorResponse(String error, List<ValidationFieldError> fields) {
    }

    public record ValidationFieldError(String field, String message) {
    }
}
