import * as AWS from 'aws-sdk';
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
                accessKeyId: AWS.config && AWS.config.credentials && AWS.config.credentials.accessKeyId.substr(0,5).padEnd(20, '•'),
                secretAccessKey: ''.padEnd(40, '•'),
                region: AWS.config.region
            }
            res.render('settings', { validConfig, title: 'Settings', data });
        } else if (alreadyConfigured) {
            // Already Configured but not yet locally usable, decrypt it
            console.log('>> NOT VALID BUT SAVED. DECRYPTING NOW.');
            res.redirect('/settings/decrypt');
        } else {
            // Yet to be set by User
            // Make sure to encrypt with a User Provided Master Password
            console.log('>> NOT SET.');
            res.render('settings', { title: 'Settings' });
        }
    } catch (err) {
        logger.error({ message: err.message, stack: err.stack });
        next(err)
    }
});

router.post('/settings', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await ESClient.create({
            index: 'metadata',
            type: 'configurations',
            id: 'aws',
            body: {
                accessKeyId: encrypt(req.body.accessKeyId),
                secretAccessKey: encrypt(req.body.secretAccessKey),
                region: req.body.region
            }
        });
        res.redirect('/settings');
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

router.get('/settings/decrypt', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await ESClient.get<IAWSUserConfig>({
            index: 'metadata',
            type: 'configurations',
            id: 'aws'
        });

        // TODO: only update after verifying master password and decrypting
        AWS.config.update({
            accessKeyId: decrypt(config._source.accessKeyId),
            secretAccessKey: decrypt(config._source.secretAccessKey),
            region: config._source.region,
        })
        res.redirect('/settings');
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