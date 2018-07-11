import { config as AWSConfig } from 'aws-sdk';
import { Router, Request, Response, NextFunction } from 'express';
import cloudWatchRoutes from './cloudwatch';
import { validAwsConfig, IAWSUserConfig } from '../config/aws';
import { ESClient } from '../index';
import logger from '../utils/logger';
import { encrypt, decrypt } from '../encryption';

const router = Router();

router.use('/fetch', cloudWatchRoutes);

// TODO: Needs Refactor (to be done after completing the flow)
router.get('/settings', async (req: Request, res: Response, next: NextFunction) => {
    const validConfig = validAwsConfig();
    const alreadyConfigured = await ESClient.exists({
        index: 'metadata',
        type: 'configurations',
        id: 'aws'
    });
    try {
        if (validConfig) {
            // Valid AWS configuration
            console.log('>> VALID');
            const data = {
                accessKeyId: AWSConfig && AWSConfig.credentials && AWSConfig.credentials.accessKeyId.substr(0,5).padEnd(20, '•'),
                secretAccessKey: ''.padEnd(40, '•'),
                region: AWSConfig.region
            }
            res.render('settings/available', { title: 'Settings', data });
        } else if (alreadyConfigured) {
            // Already Configured but not yet locally usable, decrypt it
            console.log('>> NOT VALID BUT SAVED. DECRYPTING NOW.');
            res.render('settings/configured', { title: 'Settings' });
        } else {
            // Yet to be set by User
            // Make sure to encrypt with a User Provided Master Password
            console.log('>> NOT SET.');
            res.render('settings/not-set', { title: 'Settings' });
        }
    } catch (err) {
        logger.error({ message: err.message, stack: err.stack });
        next(err)
    }
});

router.post('/settings', async (req: Request, res: Response, next: NextFunction) => {
    try {

        // COPY-PASTA from L#99
        const accessKeyIdRegex = /(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])/;
        const secretAccessKeyRegex = /(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/;

        if (accessKeyIdRegex.test(req.body.accessKeyId) && secretAccessKeyRegex.test(req.body.secretAccessKey)) {
            await ESClient.create({
                index: 'metadata',
                type: 'configurations',
                id: 'aws',
                body: {
                    accessKeyId: encrypt(req.body.accessKeyId, req.body.masterPassword),
                    secretAccessKey: encrypt(req.body.secretAccessKey, req.body.masterPassword),
                    region: req.body.region
                }
            });
            res.redirect('/settings');
        } else {
            res.render('settings/not-set', { title: 'Settings', error: 'The credentials do not match the AWS credential type. Please enter valid credentials.' });
        }
    } catch (err) {
        logger.error({ message: err.message, stack: err.stack });
        next(err)
    }
});

// not yet used
router.delete('/settings', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await ESClient.delete({
            index: 'metadata',
            type: 'configurations',
            id: 'aws'
        });
        res.redirect('/settings');
    } catch (err) {
        logger.error({ message: err.message, stack: err.stack });
        next(err)
    }
});

router.get('/settings/decrypt', (req: Request, res: Response) => {
    res.redirect('/settings');
});

router.post('/settings/decrypt', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await ESClient.get<IAWSUserConfig>({
            index: 'metadata',
            type: 'configurations',
            id: 'aws'
        });

        // Decrypting using the sent password, but not sure if true
        const accessKeyId = decrypt(config._source.accessKeyId, req.body.masterPassword);
        const secretAccessKey = decrypt(config._source.secretAccessKey, req.body.masterPassword);

        // Verifying decrypted keys with regex
        // from https://aws.amazon.com/blogs/security/a-safer-way-to-distribute-aws-credentials-to-ec2/
        const accessKeyIdRegex = /(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])/;
        const secretAccessKeyRegex = /(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/;

        if (accessKeyIdRegex.test(accessKeyId) && secretAccessKeyRegex.test(secretAccessKey)) {
            AWSConfig.update({
                accessKeyId: decrypt(config._source.accessKeyId, req.body.masterPassword),
                secretAccessKey: decrypt(config._source.secretAccessKey, req.body.masterPassword),
                region: config._source.region,
            })
            res.redirect('/settings');
        } else {
            res.render('settings/configured', { title: 'Settings', error: 'Invalid Password. Please try again.' });
        }
    } catch (err) {
        logger.error({ message: err.message, stack: err.stack });
        next(err)
    }
})

export default router;

/**
 * STAGES POSSIBLE:
 *
 *   1. Not Configured (doesn't exist)
 *   2. Configured yet not available (exists remotely, not valid locally)
 *   3. Valid
 */