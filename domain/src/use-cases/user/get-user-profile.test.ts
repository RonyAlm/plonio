import {  describe, expect, test } from 'vitest';
import { getUserProfile } from './get-user-profile.js';
import { MokedUserService } from '../../services/mocks/mock-user-service.js';

describe("GetUserProfile", async () => {
  
  const userService = MokedUserService();
  const dependencies = {
    userService: userService
  }

  test("should get user profile successfully", async () => {

    const result = await getUserProfile({
      dependencies: dependencies,
      payload: {
        userId: 'user-1'
      }
    });
    
    expect(result.isSuccess).toBe(true);
    expect(result.isSuccess && result.data).toBeDefined();
  });

  test ("should return error if userId is empty", async () => {

    const result = await getUserProfile({
      dependencies: dependencies,
      payload: {
        userId: ""
      }
    });
    
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe("Missing credentials");
  });

  test ("should return error if user not found", async () => {

    const result = await getUserProfile({
      dependencies: dependencies,
      payload: {
        userId: "user-not-found"
      }
    });
    
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe("Missing credentials");
  });

});