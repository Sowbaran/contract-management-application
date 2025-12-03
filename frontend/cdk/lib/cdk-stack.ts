import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { SPADeploy } from "@nrldigitaltechnology/nrl-cdk/lib/constructs/spa";
import { appName } from "../utils";

interface NrlInternalFormsFrontendStackProps extends cdk.StackProps {
  hostedZone: string;
  certificate: string;
  environment: string;
}

export class NrlInternalFormsFrontendStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: NrlInternalFormsFrontendStackProps
  ) {
    super(scope, id, props);

    // Create an S3 Deployment
    const deploy = new SPADeploy(this, appName, { encryptBucket: true });

    if (props.environment === "prd") {
      // App
      deploy.createSiteFromHostedZone({
        zoneName: props?.hostedZone,
        // subdomain: appName,
        indexDoc: "index.html",
        websiteFolder: "../dist",
        appName: appName,
        certificateARN: props?.certificate,
      });
    } else {
      // App
      deploy.createSiteFromHostedZone({
        zoneName: props?.hostedZone,
        subdomain: appName,
        indexDoc: "index.html",
        websiteFolder: "../dist",
        appName: appName,
        certificateARN: props?.certificate,
      });
    }

    // Storybook
    new SPADeploy(this, `${appName}-storybook`).createSiteWithCloudfront({
      indexDoc: "index.html",
      websiteFolder: "../storybook-static",
      appName: `${appName}-storybook`,
    });
  }
}
