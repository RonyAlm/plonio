import { beforeAll, describe, expect, test } from 'vitest';
import { getUserProfile } from './get-user-profile.js';
import { MokedPasswordService, MokedTokenService, MokedUserService } from '../../services/mocks/mock-user-service.js';
import { loginUser } from './login-user.js';
import { getUser } from './get-user.js';

describe("GetUser", async () => {
  
  test("should get user successfully", async () => {
    const userService = MokedUserService();
    const idUser = "1324";

    const result = await getUser({
      dependencies: {
        userService: userService,
      },
      payload: {
        idUser: idUser
      }
    });
    
    expect(result.isSuccess).toBe(true);
    expect(result.isSuccess && result.user).toBeDefined();
    expect(result.isSuccess && result.user && result.user.id).toBe(idUser);
  });

  test("should return error if user not found", async () => {
    const userService = MokedUserService();
    const idUser = "user-not-found";

    const result = await getUser({
      dependencies: {
        userService: userService,
      },
      payload: {
        idUser: idUser
      }
    });
    
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe("User not found");
  });


});