package com.restaurant.common.security.aspect;

import com.restaurant.common.annotation.RequiresRole;
import com.restaurant.common.security.authorization.RoleBasedAuthorizationService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Aspect for handling role-based authorization using AOP across all microservices.
 * Follows Single Responsibility Principle by handling only authorization concerns.
 * Follows Open/Closed Principle by allowing new authorization rules without modifying existing code.
 */
@Aspect
@Component
@RequiredArgsConstructor
public class AuthorizationAspect {

    private final RoleBasedAuthorizationService roleBasedAuthorizationService;

    /**
     * Intercepts method calls annotated with @RequiresRole and performs authorization check.
     * 
     * @param joinPoint the join point representing the method call
     * @param requiresRole the annotation containing required roles
     */
    @Before("@annotation(requiresRole)")
    public void checkAuthorization(JoinPoint joinPoint, RequiresRole requiresRole) {
        HttpServletRequest request = getCurrentHttpRequest();
        if (request == null) {
            throw new IllegalStateException("No HTTP request context available");
        }

        String userRole = request.getHeader("X-User-Role");
        roleBasedAuthorizationService.validateRole(userRole, requiresRole.value());
    }

    /**
     * Extracts the current HTTP request from the Spring context.
     * 
     * @return the current HTTP request or null if not available
     */
    private HttpServletRequest getCurrentHttpRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attributes != null ? attributes.getRequest() : null;
    }
}
