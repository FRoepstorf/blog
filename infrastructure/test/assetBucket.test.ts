import { Template } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import { InfrastructureStack } from "../lib/infrastructure-stack";

describe("AssetBucket stack", () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "Stack");

    const infrastructureStack = new InfrastructureStack(app, "StateMachineStack");
    const template = Template.fromStack(infrastructureStack);

    test("S3 bucket has private access control", () => {
        template.hasResourceProperties("AWS::S3::Bucket", {
            AccessControl: "Private",
        });
    });
    test("S3 bucket has update policy set to retain", () => {
        template.hasResource("AWS::S3::Bucket", {
            UpdateReplacePolicy: "Retain",
            DeletionPolicy: "Retain",
        });
    });
});
