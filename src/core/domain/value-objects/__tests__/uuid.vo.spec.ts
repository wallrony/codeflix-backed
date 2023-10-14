import { v4 as uuidv4, validate as validateUUID } from "uuid";
import { InvalidUUIDError, UUID } from "../uuid.vo";

describe("UUID Value Object Unit Tests", () => {
  const validateSpy = jest.spyOn(UUID.prototype as any, "validate");

  test("should be valid when providing a valid UUID", () => {
    const mockedUUID = uuidv4();
    try {
      const uuid = new UUID(mockedUUID);
      expect(uuid).toBeDefined();
      expect(uuid.id).toBeDefined();
    } catch (e) {
      fail("Should not throw an error");
    }
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should throw an UUIDInvalidError when providing an invalid UUID", () => {
    expect(() => {
      new UUID("wrong-uuid");
    }).toThrowError(new InvalidUUIDError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should generate a new UUID when not providing one", () => {
    const uuid = new UUID();
    expect(uuid).toBeDefined();
    expect(uuid.id).toBeDefined();
    expect(validateUUID(uuid.id)).toBe(true);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should return and stringified id when using toString method", () => {
    const uuid = new UUID();
    expect(uuid).toBeDefined();
    expect(uuid.id).toBeDefined();
    expect(uuid.toString()).toBe(uuid.id);
  });
});
