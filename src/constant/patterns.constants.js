'use strict';

/**
 * Regular expression for validating email addresses.
 *
 * This pattern checks for a typical structure of an email address, ensuring it includes:
 * - A local part preceding the '@' symbol
 * - Valid characters in the local part, including alphanumeric characters and special characters
 * - A domain part following the '@' symbol with periods separating domain labels
 * - A top-level domain of at least two characters
 *
 * This regex does not validate the existence of the email domain or its active SMTP configuration.
 *
 * @example
 * // Returns true for valid emails
 * console.log(isValidEmail("example@example.com")); // true
 * console.log(isValidEmail("user.name@sub.domain.com")); // true
 *
 * // Returns false for invalid emails
 * console.log(isValidEmail("example.com")); // false (missing '@')
 * console.log(isValidEmail("example@.com")); // false (missing domain name)
 *
 * @param {string} email The email string to be validated.
 * @returns {boolean} Returns true if the email matches the pattern, false otherwise.
 */
const EMAIL =
    /^(?!.*\btemp\b)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const patterns = {
    EMAIL,
};

export default patterns;
