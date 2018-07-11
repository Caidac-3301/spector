import { NextFunction, Request, Response } from 'express';
import { validAwsConfig } from './utils/aws';

/**
 * Middleware to check if AWS is configured
 * If true then continue, else redirect to settings
 */
export const isConfigured = (req: Request, res: Response, next: NextFunction) => {
    if (validAwsConfig())
        return next();

    res.redirect('/settings');
};
