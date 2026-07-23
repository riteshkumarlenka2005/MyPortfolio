/**
 * AI Communication Engine — Validation Engine
 * Validates and sanitizes all user input before processing.
 */

import { AIError, AIErrorCode } from '../types/error.types';
import type { ContactFormData } from '../types/ai.types';

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormData, string>>;
}

export class ValidationEngine {
  validate(data: ContactFormData): ValidationResult {
    const errors: Partial<Record<keyof ContactFormData, string>> = {};

    // Full Name
    const name = data.fullName.trim();
    if (!name) {
      errors.fullName = 'Full name is required';
    } else if (name.length < 2) {
      errors.fullName = 'Name must be at least 2 characters';
    } else if (name.length > 100) {
      errors.fullName = 'Name is too long';
    }

    // Email
    const email = data.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone
    const phone = data.phone?.trim() ?? '';
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone) {
      errors.phone = 'Phone number is required';
    } else if (phoneDigits.length < 7) {
      errors.phone = 'Please enter a valid phone number';
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }

  /** Sanitize user input — strip dangerous characters, trim whitespace */
  sanitize(text: string): string {
    return text
      .trim()
      .replace(/<[^>]*>/g, '')              // strip HTML tags
      .replace(/javascript:/gi, '')          // strip JS injection
      .replace(/on\w+\s*=/gi, '')            // strip event handlers
      .substring(0, 2000);                   // hard cap
  }

  sanitizeForm(data: ContactFormData): ContactFormData {
    return {
      fullName: this.sanitize(data.fullName),
      email:    this.sanitize(data.email).toLowerCase(),
      phone:    this.sanitize(data.phone ?? ''),
      location: data.location ? this.sanitize(data.location) : undefined,
    };
  }

  /** Throws AIError if validation fails */
  validateOrThrow(data: ContactFormData): ContactFormData {
    const result = this.validate(data);
    if (!result.valid) {
      throw new AIError(AIErrorCode.VALIDATION_ERROR, JSON.stringify(result.errors));
    }
    return this.sanitizeForm(data);
  }
}
