'use strict';

import sendEmailSchema from './sendEmail.schema.js';

import validateWithSchema from '../../../shared/validateWithSchema.js';

const sendEmail = validateWithSchema([
    {
        schema: sendEmailSchema.sendEmail,
        property: 'body',
    },
]);

const sendEmailValidator = {
    sendEmail,
};

export default sendEmailValidator;
