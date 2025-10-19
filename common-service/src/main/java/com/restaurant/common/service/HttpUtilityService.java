package com.restaurant.common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Common HTTP utility service for standardized HTTP request patterns across all microservices.
 *
 * <p>
 * This service provides reusable methods for common HTTP operations, eliminating
 * code duplication and ensuring consistent request/response handling across
 * all microservices in the restaurant system.
 * </p>
 *
 * <p><b>Benefits:</b></p>
 * <ul>
 *   <li>Eliminates code duplication across services</li>
 *   <li>Standardizes HTTP request patterns</li>
 *   <li>Centralizes error handling logic</li>
 *   <li>Easy to extend with common functionality</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class HttpUtilityService {

    // ==================== CONSTANTS ====================
    // Error Messages
    private static final String HTTP_REQUEST_FAILED_MSG = "HTTP request failed: %s";
    
    // ==================== DEPENDENCIES ====================
    private final RestTemplate restTemplate;

    /**
     * Sends a POST request with JSON content type and returns the response.
     *
     * <p>
     * This method creates standardized HTTP headers with JSON content type
     * and sends a POST request to the specified URL with the provided request body.
     * </p>
     *
     * @param url the target URL for the POST request
     * @param requestBody the request body to send
     * @param responseType the expected response type
     * @param <T> the type of the request body
     * @param <R> the type of the response
     * @return ResponseEntity containing the response
     * @throws RuntimeException if the request fails
     */
    public <T, R> ResponseEntity<R> postJsonRequest(String url, T requestBody, Class<R> responseType) {
        try {
            HttpHeaders headers = createJsonHeaders();
            HttpEntity<T> requestEntity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<R> response = restTemplate.postForEntity(url, requestEntity, responseType);
            
            return response;
            
        } catch (Exception e) {
            throw new RuntimeException(String.format(HTTP_REQUEST_FAILED_MSG, e.getMessage()), e);
        }
    }

    /**
     * Creates standardized HTTP headers with JSON content type.
     *
     * <p>
     * This method creates consistent HTTP headers that are used across all
     * microservices for JSON-based communication.
     * </p>
     *
     * @return HttpHeaders with JSON content type
     */
    public HttpHeaders createJsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}
