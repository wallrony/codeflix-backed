import { UUID } from "../../value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category Unit Tests", () => {
  let validatorSpy: jest.SpyInstance<boolean, [fields?: string[]], any>;

  beforeEach(() => {
    validatorSpy = jest.spyOn(Category.prototype, "validate");
  });

  describe("constructor", () => {
    test("should create a category instance when providing the mandatory properties", () => {
      const props = {
        name: "Movie",
      };

      const category = new Category(props);

      expect(category.categoryId).toBeDefined();
      expect(category.categoryId).toBeInstanceOf(UUID);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.isActive).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
    });

    test("should create a category instance when providing all properties", () => {
      const createdAt = new Date();
      const props = {
        categoryId: new UUID(),
        name: "Movie",
        description: "Movie category",
        isActive: false,
        createdAt: createdAt,
      };

      const category = new Category(props);

      expect(category.categoryId).toBeDefined();
      expect(category.categoryId).toBeInstanceOf(UUID);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie category");
      expect(category.isActive).toBeFalsy();
      expect(category.createdAt).toBe(createdAt);
    });

    test("should create a category instance when providing only name and description", () => {
      const props = {
        name: "Movie",
        description: "Movie category",
      };

      const category = new Category(props);

      expect(category.categoryId).toBeDefined();
      expect(category.categoryId).toBeInstanceOf(UUID);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie category");
      expect(category.isActive).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
    });
  });

  describe("create command", () => {
    test("should create a category instance when providing the mandatory properties", () => {
      const props = {
        name: "Movie",
      };

      const category = Category.create(props);

      expect(category.categoryId).toBeDefined();
      expect(category.categoryId).toBeInstanceOf(UUID);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.isActive).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(validatorSpy).toHaveBeenCalledTimes(1);
    });

    test("should create a category instance when providing all properties", () => {
      const createdAt = new Date();
      const props = {
        name: "Movie",
        description: "Movie category",
        isActive: false,
        createdAt: createdAt,
      };

      const category = Category.create(props);

      expect(category.categoryId).toBeDefined();
      expect(category.categoryId).toBeInstanceOf(UUID);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie category");
      expect(category.isActive).toBeFalsy();
      expect(category.createdAt).toBe(createdAt);
      expect(validatorSpy).toHaveBeenCalledTimes(1);
    });

    test("should create a category instance when providing only name and description", () => {
      const props = {
        name: "Movie",
        description: "Movie category",
      };

      const category = Category.create(props);

      expect(category.categoryId).toBeDefined();
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie category");
      expect(category.isActive).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(validatorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("categoryId field", () => {
    const arrange = [
      { categoryId: null },
      { categoryId: undefined },
      { categoryId: new UUID() },
    ];

    test.each(arrange)("id = %j", ({ categoryId }) => {
      const category = new Category({
        categoryId,
        name: "Movie",
      });
      expect(category.categoryId).toBeInstanceOf(UUID);
    });
  });

  test("shoud change category name when using changeName method", () => {
    const props = {
      name: "Movie",
    };

    const category = Category.create(props);

    expect(category.name).toBe("Movie");

    category.changeName("Movie 2");

    expect(category.name).toBe("Movie 2");
    expect(validatorSpy).toHaveBeenCalledTimes(2);
  });

  test("shoud change category description when using changeDescription method", () => {
    const props = {
      name: "Movie",
      description: "Movie category",
    };

    const category = Category.create(props);

    expect(category.name).toBe("Movie");
    expect(category.description).toBe("Movie category");

    category.changeDescription("Movie category 2");

    expect(category.description).toBe("Movie category 2");
    expect(validatorSpy).toHaveBeenCalledTimes(2);
  });

  test("shoud activate category when using activate method", () => {
    const props = {
      name: "Movie",
      isActive: false,
    };

    const category = Category.create(props);

    expect(category.name).toBe("Movie");
    expect(category.isActive).toBeFalsy();

    category.activate();

    expect(category.isActive).toBeTruthy();
    expect(validatorSpy).toHaveBeenCalledTimes(1);
  });

  test("shoud deactivate category when using deactivate method", () => {
    const props = {
      name: "Movie",
      isActive: true,
    };

    const category = Category.create(props);

    expect(category.name).toBe("Movie");
    expect(category.isActive).toBeTruthy();

    category.deactivate();

    expect(category.isActive).toBeFalsy();
    expect(validatorSpy).toHaveBeenCalledTimes(1);
  });
});

describe("Category Validator Unit Tests", () => {
  describe("create command", () => {
    test("should throw invalid category when providing an invalid name property", () => {
      expect(() => Category.create({ name: null })).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => Category.create({ name: "" })).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => Category.create({ name: 1 as any })).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() =>
        Category.create({ name: "t".repeat(256) })
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });
  });

  describe("changeName method", () => {
    const mockedCategory = Category.create({ name: "Movie" });

    test("should throw invalid category when providing an invalid name property", () => {
      expect(() => mockedCategory.changeName(null)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => mockedCategory.changeName("")).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => mockedCategory.changeName(1 as any)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() =>
        mockedCategory.changeName("t".repeat(256))
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });
  });

  describe("changeDescription method", () => {
    const mockedCategory = Category.create({ name: "Movie" });

    test("should throw invalid category when providing an invalid name property", () => {
      expect(() =>
        mockedCategory.changeDescription(null)
      ).containsErrorMessages({
        description: [
          "description should not be empty",
          "description must be a string",
          "description must be shorter than or equal to 65555 characters",
        ],
      });

      expect(() => mockedCategory.changeDescription("")).containsErrorMessages({
        description: ["description should not be empty"],
      });

      expect(() =>
        mockedCategory.changeDescription(1 as any)
      ).containsErrorMessages({
        description: [
          "description must be a string",
          "description must be shorter than or equal to 65555 characters",
        ],
      });

      expect(() =>
        mockedCategory.changeDescription("t".repeat(65556))
      ).containsErrorMessages({
        description: [
          "description must be shorter than or equal to 65555 characters",
        ],
      });
    });
  });
});
