export interface AuthService {
  generateTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }>;
  verifyToken(token: string): Promise<{ userId: string } | null>;
}
