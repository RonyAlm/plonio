import {  describe, expect, test } from 'vitest';
import { getUserProfile } from './get-user-profile.js';
import { MokedUserService } from '../../services/mocks/mock-user-service.js';

describe("GetUserProfile", async () => {
  
  const userService = MokedUserService();
  let userIdToken: string;

  test("should get user profile successfully", async () => {

    userIdToken = "user-1";

    const result = await getUserProfile({
      dependencies: {
        userService: userService,
      },
      payload: {
        userId: userIdToken
      }
    });
    
    expect(result.isSuccess).toBe(true);
    expect(result.isSuccess && result.data).toBeDefined();
    expect(result.isSuccess && result.data && result.data.id).toBe(userIdToken);
  });

  test ("should return error if userId is empty", async () => {

    const result = await getUserProfile({
      dependencies: {
        userService: userService
      },
      payload: {
        userId: ""
      }
    });
    
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe("User ID is required");
  });

  test ("should return error if user not found", async () => {

    const result = await getUserProfile({
      dependencies: {
        userService: userService
      },
      payload: {
        userId: "user-not-found"
      }
    });
    
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe("User not found");
  });

});