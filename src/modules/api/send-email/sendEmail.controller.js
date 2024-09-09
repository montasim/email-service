'use strict';

import sendEmailService from './sendEmail.service.js';

import asyncErrorHandlerService from '../../../utilities/asyncErrorHandler.js';

const sendEmail = asyncErrorHandlerService(async (req, res) => {
    const emailData = await sendEmailService.sendEmail(req.body);

    emailData.route = req.originalUrl;
    res.status(emailData.status).send(emailData);
});

const sendEmailController = {
    sendEmail,
};

export default sendEmailController;
