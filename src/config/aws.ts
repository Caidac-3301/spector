import * as AWS from 'aws-sdk';

export interface IAWSUserConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
}

export const validAwsConfig = () => {
    return !!AWS.config.credentials && !!AWS.config.region;
}
