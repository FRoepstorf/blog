import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {OriginAccessIdentity} from "aws-cdk-lib/aws-cloudfront";
import * as path from "node:path";

export class CloudfrontDistribution extends Construct {
    public readonly distribution: cdk.aws_cloudfront.Distribution;

    constructor(scope: Construct, id: string, bucket: cdk.aws_s3.Bucket) {
        super(scope, id);

        const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
        bucket.grantRead(originAccessIdentity);

        const cloudfrontFunction = new cdk.aws_cloudfront.Function(this, 'CloudfrontFunction', {
            code: cdk.aws_cloudfront.FunctionCode.fromFile({
                filePath: path.join(__dirname, 'fileSuffixRewrite.js'),
            }),
            runtime: cdk.aws_cloudfront.FunctionRuntime.JS_2_0,
        });

        const responseHeadersPolicy = new cdk.aws_cloudfront.ResponseHeadersPolicy(this, 'ResponseHeadersPolicy', {
            customHeadersBehavior: {
                customHeaders: [
                    {
                        header: 'Cache-Control',
                        value: 'max-age=3600, stale-while-revalidate=600, stale-if-error=86400',
                        override: true
                    },
                ]
            },
        })

        this.distribution = new cdk.aws_cloudfront.Distribution(this, 'AssetDistribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: new cdk.aws_cloudfront_origins.S3Origin(bucket, {originAccessIdentity}),
                responseHeadersPolicy,
                functionAssociations: [
                    {
                        function: cloudfrontFunction,
                        eventType: cdk.aws_cloudfront.FunctionEventType.VIEWER_REQUEST,
                    },
                ],
            },
        });
    }
}
