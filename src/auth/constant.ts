import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const jwtConstants = {
  accessTokenSecret: configService.get<string>(
    'JWT_ACCESS_SECRET_KEY',
    'access-token-secret',
  ),
  refreshTokenSecret: configService.get<string>(
    'JWT_REFRESH_SECRET_KEY',
    'refresh-token-secret',
  ),
  accessTokenExpiresIn: configService.get<string>(
    'JWT_ACCESS_TOKEN_EXPIRES_IN',
    '1m',
  ),
  refreshTokenExpiresIn: configService.get<string>(
    'JWT_REFRESH_TOKEN_EXPIRES_IN',
    '15d',
  ),
};

export const cookieConstants = {
  accessTokenName: 'access_token',
  refreshTokenName: 'refresh_token',
  accessTokenOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 60 * 1000, // 1m in milliseconds
  },
  refreshTokenOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 15 * 60 * 1000, // 15d in milliseconds
  },
};
