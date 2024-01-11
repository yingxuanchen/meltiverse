package com.lemonz.meltiverse.config;

import com.lemonz.meltiverse.entity.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Unauthorized access"));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex) {
        log.error("ResponseStatusException", ex);
        return ResponseEntity.status(ex.getStatusCode()).body(new ErrorResponse(ex.getReason()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllUnknownException(Exception ex) {
        log.error("Unknown error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Unknown error"));
    }
}
