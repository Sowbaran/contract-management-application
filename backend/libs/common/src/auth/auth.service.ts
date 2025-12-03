import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService extends PassportStrategy(JwtStrategy, "jwt") {
  constructor(private readonly configService: ConfigService) {
    const domain = configService.get("AUTH0_DOMAIN") || "";

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: `https://${domain}/`,
      algorithms: ["RS256"],
    });
  }

  validate(payload: any) {
    const email = payload.email || payload["https://your-app.com/email"];

    if (!email) {
      throw new InternalServerErrorException("Email not found in token");
    }

    // Map JWT payload to expected user object structure
    return {
      email,
      preferred_username: email, // Map email to preferred_username for backward compatibility
      name: payload.name || payload.nickname || (payload.given_name && payload.family_name ? `${payload.given_name} ${payload.family_name}` : email), // Use name fields from ID token
      sub: payload.sub,
      permissions: payload.permissions || [],
      roles: payload["https://your-app.com/roles"] || [],
      // Include ID token specific fields
      given_name: payload.given_name,
      family_name: payload.family_name,
      nickname: payload.nickname,
      picture: payload.picture,
      email_verified: payload.email_verified,
      updated_at: payload.updated_at,
      ...payload, // Include all other payload properties
    };
  }

}
