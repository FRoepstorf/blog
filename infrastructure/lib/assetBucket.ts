import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class AssetBucket extends Construct {
    public readonly bucket: cdk.aws_s3.Bucket;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.bucket = new cdk.aws_s3.Bucket(this, 'AssetBucket', {
            versioned: false,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            accessControl: cdk.aws_s3.BucketAccessControl.PRIVATE,
        });
    }
}
