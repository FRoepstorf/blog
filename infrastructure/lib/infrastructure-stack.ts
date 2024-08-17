import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AssetBucket } from './assetBucket';
import { CloudfrontDistribution } from './cloudfrontDistribution';
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";

export class InfrastructureStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const s3Bucket = new AssetBucket(this, 'AssetBucket');
        const cloudFrontDistribution = new CloudfrontDistribution(this, 'CloudFrontDistribution', s3Bucket.bucket);

        new BucketDeployment(this, 'DeployWebsite', {
            sources: [Source.asset('../storage/app/static')],
            destinationBucket: s3Bucket.bucket,
            distribution: cloudFrontDistribution.distribution,
        })
    }
}
