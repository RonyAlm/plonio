import jwt from "jsonwebtoken";
import { AuthService } from "../../../../domain/dist/index.js";


export class AuthServiceJwt implements AuthService  {
  
  constructor() {}
  
  async generateTokens(userId : string) {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "14d" });
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "10d" });
    return { accessToken, refreshToken };
  }

  async verifyToken(token : string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      return { userId: decoded.userId };
    } catch {
      return null;
    }
  }
  
};