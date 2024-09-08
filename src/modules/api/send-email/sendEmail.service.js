'use strict';

import httpStatus from '../../../constant/httpStatus.constants.js';
import EmailService from '../../../service/email.service.js';
import loggerService from '../../../service/logger.service.js';

import sendResponse from '../../../utilities/sendResponse.js';
import prepareEmailContent from '../../../shared/prepareEmailContent.js';
import prepareEmail from '../../../shared/prepareEmail.js';
import errorResponse from '../../../utilities/errorResponse.js';

const sendEmail = async (emailData) => {
    try {
        const {
            pageTitle,
            preheaderText,
            heroSection,
            mainSection,
            footerContent,
        } = prepareEmailContent(emailData?.subject, emailData);

        const sendEmailResult = await EmailService.sendEmail(
            emailData.email,
            emailData?.subject,
            prepareEmail(
                pageTitle,
                preheaderText,
                heroSection,
                mainSection,
                footerContent
            )
        );

        return sendResponse(
            sendEmailResult,
            'Email send successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to end email: ${error}`);

        return errorResponse(
            error.message || 'Failed to end email.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const sendEmailService = {
    sendEmail,
};

export default sendEmailService;
