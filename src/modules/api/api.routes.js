'use strict';

import express from 'express';

import sendEmailRoutes from './send-email/sendEmail.routes.js';

const router = express.Router();

// Application routes
router.use('/send-email', sendEmailRoutes);

export default router;
