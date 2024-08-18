import {Match, Template} from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import { InfrastructureStack } from "../lib/infrastructure-stack";

describe("CloudfrontDistribution stack", () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "Stack");

    const infrastructureStack = new InfrastructureStack(app, "StateMachineStack");
    const template = Template.fromStack(infrastructureStack);
    test("Cloudfront distribution has default root object", () => {
        template.hasResourceProperties("AWS::CloudFront::Distribution", {
            DistributionConfig: {
                DefaultRootObject: "index.html",
            }
        });
    });
    test("Cloudfront distribution has cloudfront function attached", () => {
        template.hasResourceProperties("AWS::CloudFront::Distribution", {
            DistributionConfig: {
                DefaultCacheBehavior: {
                    FunctionAssociations: [
                        {
                            FunctionARN: {
                                "Fn::GetAtt": [
                                    Match.stringLikeRegexp("CloudfrontFunction*"),
                                    "FunctionARN"
                                ]
                            },
                            EventType: "viewer-request"
                        }],
            }
        }
    })});
    test("Cloudfront distribution has cloudfront function defined", () => {
        template.hasResourceProperties("AWS::CloudFront::Function", {
            AutoPublish: true,
            FunctionConfig: {
                Runtime: "cloudfront-js-2.0",
            }
        });
    });
    test('Cloudfront is allowed to read the s3 bucket', () => {
        template.hasResourceProperties("AWS::S3::BucketPolicy", {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            "s3:GetObject*",
                            "s3:GetBucket*",
                            "s3:List*"
                        ],
                        Effect: "Allow",
                        Principal: {
                            CanonicalUser: {
                                "Fn::GetAtt": [
                                    Match.stringLikeRegexp("CloudFrontDistributionOriginAccessIdentity*"),
                                    "S3CanonicalUserId"
                                ]
                            }
                        },
                        Resource: [
                            {
                                "Fn::GetAtt": [
                                    Match.stringLikeRegexp("AssetBucket*"),
                                    "Arn"
                                ]
                            },
                            {
                                "Fn::Join": [
                                    "",
                                    [
                                        {
                                            "Fn::GetAtt": [
                                                Match.stringLikeRegexp("AssetBucket*"),
                                                "Arn"
                                            ]
                                        },
                                        "/*"
                                    ]
                                ]
                            }
                        ]
                    },
                    Match.anyValue()
                ]
            }
        });
    });
});
