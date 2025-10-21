import { beforeAll, describe, expect, test } from 'vitest';
import { getUserProfile } from './get-user-profile.js';
import { MokedPasswordService, MokedTokenService, MokedUserService } from '../../services/mocks/mock-user-service.js';
import { loginUser } from './login-user.js';

describe("GetUserProfile", async () => {
  let token: string;
  let user: any;

  beforeAll( async () => {
    const userService = MokedUserService();
    const tokenService = MokedTokenService();
    const passwordService = MokedPasswordService();

    const login = await loginUser({
      dependencies: {
        userService: userService,
        passwordService: passwordService,
        tokenService: tokenService
      },
      payload: {
        email: "ema@ema.com",
        password: "ema123" 
      }
    });

    if(login.isSuccess && login.accessToken) {
      token = login.accessToken;
      user = login.user;
    }

  });
  
  test("should get user profile if token is valid", async () => {
    const userService = MokedUserService();
    const tokenService = MokedTokenService();

    const result = await getUserProfile({
      dependencies: {
        userService: userService,
        tokenService: tokenService
      },
      payload: {
        token: token  
      }
    });
    
    expect(result.isSuccess).toBe(true);
    expect(result.isSuccess && result.user?.name).toBe(user.name);
    expect(result.isSuccess && result.user?.email).toBe(user.email);
    expect(result.isSuccess && result.user?.role).toBe(user.role);
  });

  test("should return error if token is invalid", async () => {
    const userService = MokedUserService();
    const tokenService = MokedTokenService();

    const result = await getUserProfile({
      dependencies: {
        userService: userService,
        tokenService: tokenService
      },
      payload: {
        token: "invalid_token"  
      }
    });
    
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe("Invalid token");
  });

});