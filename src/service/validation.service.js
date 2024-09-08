'use strict';

import Joi from 'joi';

import customValidationMessage from '../shared/customValidationMessage.js';
import patterns from '../constant/patterns.constants.js';
import constants from '../constant/constants.js';

/**
 * Generates a Joi schema for string fields with customizable minimum and maximum lengths.
 *
 * @param {number} min - The minimum length of the string.
 * @param {number} max - The maximum length of the string.
 * @returns {Joi.StringSchema} The Joi schema for the string field.
 * @example
 * const usernameField = createStringField(3, 30);
 */
const createStringField = (min, max) =>
    Joi.string().trim().min(min).max(max).messages(customValidationMessage);

/**
 * Ensures email addresses are valid and not from temporary email providers.
 *
 * @type {Joi.StringSchema}
 * @example
 * const validationResult = emailField.validate('example@example.com');
 */
const emailField = createStringField(
    constants.lengths.EMAIL_MIN,
    constants.lengths.EMAIL_MAX
)
    .email({ minDomainSegments: 2, tlds: { allow: true } })
    .regex(/^((?!tempmail|mailinator|yopmail).)*$/, 'no-temp-email')
    .pattern(patterns.EMAIL)
    .messages({
        'string.pattern.name': '"email" must not be a temporary email address',
        'string.regex.no-temp-email':
            '"email" must not be from a temporary email provider (like tempmail, mailinator, or yopmail)',
        'string.pattern.base': 'Please fill a valid email address.',
    });


const validationService = {
    createStringField,
    emailField,
};

export default validationService;
