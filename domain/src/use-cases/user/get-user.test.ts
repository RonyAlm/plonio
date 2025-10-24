import { describe, expect, test } from 'vitest';
import { MokedUserService } from '../../services/mocks/mock-user-service.js';
import { getUser } from './get-user.js';

describe("GetUser", async () => {

  const userService = MokedUserService();
  const dependencies = {
    userService: userService
  }


  test("should get user by id successfully", async () => {

    const result = await getUser({
      dependencies: dependencies,
      payload: {
        id: "user-1"
      }
    });

    expect(result.isSuccess).toBe(true);
    expect(result.isSuccess && result.data).toBeDefined();
  });

  test("should return error if user not found", async () => {

    const result = await getUser({
      dependencies: dependencies,
      payload: {
        id: "user-not-found"
      }
    });

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe("User not found");
  });

  test("should return all users if id is empty", async () => {

    const result = await getUser({
      dependencies: dependencies,
      payload: {
        id: ""
      }
    });

    expect(result.isSuccess).toBe(true);
    expect(result.isSuccess && result.data).toBeDefined();
    if (result.isSuccess && Array.isArray(result.data)) {
      expect(result.data.length).toBe(2);
    } else {
      expect(Array.isArray(result.data)).toBe(true);
    }
  });


});