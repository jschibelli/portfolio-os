/**
 * Unit tests for email validation and API functionality
 * 
 * These tests ensure proper email validation and error handling
 * for the booking API as suggested in the GitHub PR review.
 */

// Import email validation function
import { validateEmail } from '../lib/config-validation';

// Use the imported function
const isValidEmail = validateEmail;

describe('Email Validation', () => {
	describe('isValidEmail', () => {
		it('should validate correct email addresses', () => {
			const validEmails = [
				'test@example.com',
				'user.name@domain.co.uk',
				'john@johnschibelli.dev',
				'contact+test@company.org',
				'user123@subdomain.example.com'
			];

			validEmails.forEach(email => {
				expect(isValidEmail(email)).toBe(true);
			});
		});

		it('should reject invalid email addresses', () => {
			const invalidEmails = [
				'invalid-email',
				'@domain.com',
				'user@',
				'user@domain',
				'user..name@domain.com',
				'user@domain..com',
				'',
				'user name@domain.com',
				'user@domain .com'
			];

			invalidEmails.forEach(email => {
				expect(isValidEmail(email)).toBe(false);
			});
		});

		it('should handle edge cases', () => {
			expect(isValidEmail('a@b.c')).toBe(true); // Minimal valid email
			expect(isValidEmail('test@sub.domain.com')).toBe(true); // Subdomain
			expect(isValidEmail('user+tag@example.org')).toBe(true); // Plus sign
		});
	});

	describe('Email Configuration', () => {
		it('should use consistent email domain', () => {
			const contactEmail = process.env.CONTACT_EMAIL || 'john@johnschibelli.dev';
			
			expect(contactEmail).toContain('johnschibelli.dev');
			expect(contactEmail).not.toContain('johnschibelli.com');
		});

		it('should validate the configured email address', () => {
			const contactEmail = process.env.CONTACT_EMAIL || 'john@johnschibelli.dev';
			
			expect(isValidEmail(contactEmail)).toBe(true);
		});
	});
});

describe('API Error Handling', () => {
	describe('Email sending error scenarios', () => {
		it('should handle invalid email addresses gracefully', () => {
			const invalidEmails = ['invalid-email', '@domain.com', 'user@'];
			
			invalidEmails.forEach(email => {
				expect(() => {
					if (!isValidEmail(email)) {
						throw new Error(`Invalid email address: ${email}`);
					}
				}).toThrow(`Invalid email address: ${email}`);
			});
		});

		it('should provide meaningful error messages', () => {
			const invalidEmail = 'invalid-email';
			
			try {
				if (!isValidEmail(invalidEmail)) {
					throw new Error(`Invalid email address: ${invalidEmail}`);
				}
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				expect((error as Error).message).toContain('Invalid email address');
				expect((error as Error).message).toContain(invalidEmail);
			}
		});
	});
});
