package com.restaurant.common.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark methods that require specific roles for access.
 * Used with aspect-oriented programming for centralized authorization across all microservices.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresRole {
    
    /**
     * The roles required to access the annotated method.
     * 
     * @return array of required roles
     */
    String[] value();
}
