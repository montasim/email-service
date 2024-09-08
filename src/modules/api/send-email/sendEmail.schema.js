'use strict';

import Joi from 'joi';

import validationService from '../../../service/validation.service.js';
import sendEmailConstants from './sendEmail.constants.js';

const sendEmailSchemaBase = Joi.object({
    subject: validationService
        .createStringField(
            sendEmailConstants.lengths.SUBJECT_MIN,
            sendEmailConstants.lengths.SUBJECT_MAX
        )
        .messages({
            'string.pattern.base': `{#label} with value "{#value}" must start with an uppercase letter followed by lowercase letters for each word, separated by a single space if multiple words. No numbers or special characters are allowed.`,
        }),
    email: validationService.emailField,
}).strict();

const sendEmail = sendEmailSchemaBase.fork(['subject', 'email'], (field) =>
    field.required()
);

const sendEmailSchema = {
    sendEmail
};

export default sendEmailSchema;
