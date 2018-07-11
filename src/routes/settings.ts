import { config as AWSConfig } from 'aws-sdk';
import { Router, Response, Request, NextFunction } from 'express';
import logger from '../utils/logger';
import { validAwsConfig, IAWSUserConfig, setAwsConfig, validCredentials, unsetAwsConfig } from '../utils/aws';
import { ESClient } from '../index';
import { decrypt, encrypt } from '../encryption';

const router = Router();

/**
 * STAGES POSSIBLE:
 *
 *   1. Not Configured (doesn't exist)
 *   2. Configured yet not available (exists remotely, not valid locally)
 *   3. Valid
 */

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const validConfig = validAwsConfig();
    const alreadyConfigured = await ESClient.exists({
        index: 'metadata',
        type: 'configurations',
        id: 'aws'
    });
    try {
        if (validConfig) {
            // Valid AWS configuration
            const data = {
                accessKeyId: AWSConfig && AWSConfig.credentials && AWSConfig.credentials.accessKeyId.substr(0, 5).padEnd(20, '•'),
                secretAccessKey: ''.padEnd(40, '•'),
                region: AWSConfig.region
            };
            res.render('settings/available', { title: 'Settings', data });
        } else if (alreadyConfigured) {
            // Already Configured but not yet locally usable, decrypt it
            res.render('settings/configured', { title: 'Settings' });
        } else {
            // Yet to be set by User
            res.render('settings/not-set', { title: 'Settings' });
        }
    } catch (err) {
        logger.error({ message: err.message, stack: err.stack });
        next(err);
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (validCredentials(req.body.accessKeyId, req.body.secretAccessKey)) {
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
        next(err);
    }
});

router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await ESClient.delete({
            index: 'metadata',
            type: 'configurations',
            id: 'aws'
        });
        unsetAwsConfig();
        res.redirect('/');
    } catch (err) {
        logger.error({ message: err.message, stack: err.stack });
        next(err);
    }
});

router.get('/decrypt', (req: Request, res: Response) => {
    res.redirect('/settings');
});

router.post('/decrypt', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await ESClient.get<IAWSUserConfig>({
            index: 'metadata',
            type: 'configurations',
            id: 'aws'
        });

        // Decrypting using the sent password, but not sure if true so validating below
        const _accessKeyId = decrypt(config._source.accessKeyId, req.body.masterPassword);
        const _secretAccessKey = decrypt(config._source.secretAccessKey, req.body.masterPassword);

        if (validCredentials(_accessKeyId, _secretAccessKey)) {
            const accessKeyId = decrypt(config._source.accessKeyId, req.body.masterPassword);
            const secretAccessKey = decrypt(config._source.secretAccessKey, req.body.masterPassword);
            const region = config._source.region;

            setAwsConfig(accessKeyId, secretAccessKey, region);

            res.redirect('/settings');
        } else {
            res.render('settings/configured', { title: 'Settings', error: 'Invalid Password. Please try again.' });
        }
    } catch (err) {
        logger.error({ message: err.message, stack: err.stack });
        next(err);
    }
});

export default router;
