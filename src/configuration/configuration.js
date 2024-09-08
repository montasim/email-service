'use strict';

/**
 * @fileoverview This module configures and validates environment variables for the application
 * using dotenv and Joi. It imports configurations, applies environment-specific settings,
 * and validates all environmental variables against a schema to ensure they meet the required
 * format and values before the application runs. The module helps prevent runtime errors due
 * to misconfiguration and facilitates easier management of configuration settings across
 * different deployment environments (development, testing, staging, production).
 *
 * @requires module:dotenv Used to load and parse environment variables from a .env file.
 * @requires module:joi Used for schema description and environment validation.
 * @requires module:constant/envTypes.constants Constants defining environment types.
 */

import dotenv from 'dotenv';
import Joi from 'joi';

import environment from '../constant/envTypes.constants.js';

dotenv.config({
    path: `.env.${process.env.NODE_ENV || environment.DEVELOPMENT}`,
});

/**
 * Converts a given environment variable to an integer. If the conversion fails (i.e., the result is NaN),
 * it returns a specified default value. This function is useful for ensuring that environmental configurations
 * that are expected to be numeric are indeed treated as such, with a fallback mechanism in case of misconfiguration
 * or absence.
 *
 * @param {string} envVar - The environment variable to be parsed.
 * @param {number} defaultValue - The fallback value to use if parsing fails.
 * @returns {number} The parsed integer or the default value.
 */
const getInt = (envVar, defaultValue) => {
    const parsed = parseInt(envVar, 10);

    return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Retrieves an environment variable and provides a default value if the specified variable is undefined, null, or an
 * empty string. This function is crucial for configuration management, ensuring that no environment variable is left
 * unset, thereby avoiding potential runtime errors or misconfigurations in the application's operational environment.
 *
 * @param {string} envVar - The environment variable to retrieve.
 * @param {*} defaultValue - The default value to return if the specified environment variable is not set.
 * @returns {*} The value of the environment variable or the default value if the variable is not set.
 */
const getEnvVar = (envVar, defaultValue) => {
    if (envVar === undefined || envVar === null || envVar === '') {
        return defaultValue;
    }

    return envVar;
};

// Base MongoDB URL which might be appended with '-test' for test environment
const mongoDbUrl =
    getEnvVar(process.env.MONGODB_URL, '') +
    (process.env.NODE_ENV === environment.TEST ? '-test' : '');

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid(
            environment.PRODUCTION,
            environment.STAGING,
            environment.DEVELOPMENT,
            environment.TEST
        )
        .required()
        .description('The application environment.'),
    GITHUB_REPOSITORY: Joi.string()
        .required()
        .description('GitHub repository URL.'),
    VERSION: Joi.string()
        .valid('v1', 'v2', 'v3', 'v4', 'v5')
        .required()
        .description('The API version to use.'),
    PORT: Joi.number().required().description('The server port.'),
    TIMEOUT_IN_SECONDS: Joi.number()
        .required()
        .description('Timeout in seconds.'),
    CACHE_TTL_IN_SECONDS: Joi.number()
        .required()
        .description('Cache TTL in seconds.'),
    JSON_PAYLOAD_LIMIT: Joi.number()
        .required()
        .description('JSON payload limit in bytes.'),
    CORS_ORIGIN: Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .required()
        .description('CORS origin.'),
    CORS_METHODS: Joi.string().required().description('CORS methods.'),
    SMTP_HOST: Joi.string()
        .required()
        .description('Server that will send the emails.'),
    SMTP_PORT: Joi.number()
        .required()
        .description('Port to connect to the email server.'),
    SMTP_USERNAME: Joi.string()
        .required()
        .description('Username for email server.'),
    SMTP_PASSWORD: Joi.string()
        .required()
        .description('Password for email server.'),
    SMTP_MAX_CONNECTION_RETRY_ATTEMPTS: Joi.number()
        .required()
        .description('Maximum number of connection retry attempts.'),
    EMAIL_FROM: Joi.string()
        .required()
        .description('The "from" field in the emails sent by the app.'),
    ADMIN_EMAIL: Joi.string().email().required().description('Admin email.'),
    ADMIN_PASSWORD: Joi.string().required().description('Admin password.'),
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env, {
    abortEarly: false,
});

if (error) {
    throw new Error(
        `Config validation error: ${error.details.map((x) => x.message).join(', ')}`
    );
}

const configuration = {
    env: getEnvVar(envVars.NODE_ENV, environment.DEVELOPMENT),
    github: {
        repository: getEnvVar(envVars.GITHUB_REPOSITORY, ''),
    },
    version: getEnvVar(envVars.VERSION, 'v1'),
    port: getInt(getEnvVar(envVars.PORT, 3000), 3000),
    timeout: getInt(envVars.TIMEOUT_IN_SECONDS, 30),
    cache: {
        timeout: getInt(envVars.CACHE_TTL_IN_SECONDS, 60),
    },
    jsonPayloadLimit: getInt(envVars.JSON_PAYLOAD_LIMIT, 1000000),
    cors: {
        origin: getEnvVar(envVars.CORS_ORIGIN, '')
            .split(',')
            .map((origin) => origin.trim()),
        methods: getEnvVar(envVars.CORS_METHODS, '')
            .split(',')
            .map((method) => method.trim()),
    },
    email: {
        smtp: {
            host: getEnvVar(envVars.SMTP_HOST, 'localhost'),
            port: getInt(envVars.SMTP_PORT, 587),
            auth: {
                user: getEnvVar(envVars.SMTP_USERNAME, ''),
                pass: getEnvVar(envVars.SMTP_PASSWORD, ''),
            },
            maxConnectionAttempts: getInt(
                envVars.SMTP_MAX_CONNECTION_RETRY_ATTEMPTS,
                587
            ),
        },
        from: getEnvVar(envVars.EMAIL_FROM, 'no-reply@example.com'),
    },
    admin: {
        email: getEnvVar(envVars.ADMIN_EMAIL, 'admin@example.com'),
        password: getEnvVar(envVars.ADMIN_PASSWORD, ''),
    },
};

export default configuration;
