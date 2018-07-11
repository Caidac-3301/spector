import { config as AWSConfig } from 'aws-sdk';

export interface IAWSUserConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
}

export const validAwsConfig = () => {
    return !!AWSConfig.credentials && !!AWSConfig.region;
};

export const setAwsConfig = (accessKeyId: string, secretAccessKey: string, region: string) => {
    AWSConfig.update({
        accessKeyId,
        secretAccessKey,
        region,
    });
};

// Verifying decrypted keys with regex from
// https://aws.amazon.com/blogs/security/a-safer-way-to-distribute-aws-credentials-to-ec2/
export const validCredentials = (accessKeyId: string, secretAccessKey: string) => {
    const accessKeyIdRegex = /(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])/;
    const secretAccessKeyRegex = /(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/;

    return accessKeyIdRegex.test(accessKeyId) && secretAccessKeyRegex.test(secretAccessKey);
};

export const unsetAwsConfig = () => {
    AWSConfig.credentials = undefined;
    AWSConfig.region = undefined;
};
