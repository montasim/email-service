'use strict';

import express from 'express';

import sendEmailValidator from './sendEmail.validator.js';
import sendEmailController from './sendEmail.controller.js';

import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .post(
        // sendEmailValidator.sendEmail,
        sendEmailController.sendEmail
    )
    .all(methodNotSupported);

export default router;
