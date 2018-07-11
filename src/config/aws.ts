import { config as AWSConfig } from 'aws-sdk';

export interface IAWSUserConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
}

export const validAwsConfig = () => {
    return !!AWSConfig.credentials && !!AWSConfig.region;
}
