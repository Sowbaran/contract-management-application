import { EnvelopeDetailsDto } from "@src/form-approval/dto";
import { float } from "aws-sdk/clients/cloudfront";
import crypto from "crypto";

export const computeHash = (payload: string, secret: string): string => {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload); // Using update instead of write
  return hmac.digest("base64"); // Using digest for final HMAC value
};

export const validateSignatureHmac = (
  payload: EnvelopeDetailsDto,
  signature: string,
  secret: string,
): boolean => {
  const computedHash = computeHash(JSON.stringify(payload), secret); // Ensure payload is stringified
  return crypto.timingSafeEqual(
    Buffer.from(signature, "base64"),
    Buffer.from(computedHash, "base64"),
  );
};

export const escapeRegExp = (string: string): RegExp => {
  // Escape special characters
  const escapedString = string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return new RegExp(escapedString, "i");
};

export const stringToBoolean = (str: string) => {
  switch (str) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      throw new Error("Invalid input, expected 'true' or 'false'");
  }
};
export const trimStringToLength = (str: string, maxLength = 95) => {
  if (str.length >= maxLength) {
    return `${str.substring(0, maxLength - 1)} ...`;
  }
  return str;
};

export const roundDownToDecimalPlace = (
  value: float,
  decimalPlaces: number,
) => {
  const factor = 10 ** decimalPlaces;
  return Math.floor(value * factor) / factor;
};
