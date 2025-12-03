#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { NrlInternalFormsFrontendStack } from "../lib/cdk-stack";
import { appName } from "../utils";

const app = new cdk.App();

new NrlInternalFormsFrontendStack(app, `dev-${appName}`, {
  stackName: `dev-${appName}`,
  tags: {
    Application: appName,
    Team: "Data and Emerging Tech",
  },
  env: {
    region: "ap-southeast-2",
    account: "726218876423",
  },
  hostedZone: "dev.nrltechhub.com.au",
  certificate:
    "arn:aws:acm:us-east-1:726218876423:certificate/bba575c4-638a-463f-adfc-56f818b6bb6e",
  environment: "dev",
});

new NrlInternalFormsFrontendStack(app, `qa-${appName}`, {
  stackName: `qa-${appName}`,
  tags: {
    Application: appName,
    Team: "Data and Emerging Tech",
  },
  env: {
    region: "ap-southeast-2",
    account: "668155530000",
  },
  hostedZone: "qa.nrltechhub.com.au",
  certificate:
    "arn:aws:acm:us-east-1:668155530000:certificate/4893626a-748b-4f01-9d69-59095b3a7688",
  environment: "qa",
});

new NrlInternalFormsFrontendStack(app, `prd-${appName}`, {
  crossRegionReferences: true,
  stackName: `prd-${appName}`,
  tags: {
    Application: appName,
    Team: "Data and Emerging Tech",
  },
  env: {
    region: "ap-southeast-2",
    account: "357265615555",
  },
  hostedZone: "forms.nrl.com.au",
  certificate:
    "arn:aws:acm:us-east-1:357265615555:certificate/30a85d38-53df-4e8f-8633-00ff826efa3d",
  environment: "prd",
});
