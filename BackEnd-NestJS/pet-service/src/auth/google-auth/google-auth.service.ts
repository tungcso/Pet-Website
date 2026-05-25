// google-auth.service.ts
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;
  private audienceIds: string[];

  constructor(private configService: ConfigService) {
    const googleClientIds = this.configService
      .get<string>('GOOGLE_CLIENT_ID')
      ?.split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    this.audienceIds =
      googleClientIds && googleClientIds.length ? googleClientIds : [];
    this.client = new OAuth2Client(this.audienceIds[0]);
  }

  async verifyToken(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.audienceIds,
      });

      const payload = ticket.getPayload();
      if (!payload?.email || !payload?.name) {
        throw new BadRequestException(
          'Invalid Google token: missing email or name',
        );
      }

      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (error: any) {
      // Log error server-side if needed
      throw new BadGatewayException(
        `Failed to verify Google token: ${error?.message ?? 'unknown'}`,
      );
    }
  }
}
