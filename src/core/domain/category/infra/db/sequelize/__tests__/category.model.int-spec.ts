import { DataType, Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";

describe("CategoryModel Integration Tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
      logging: false,
    });
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("should map correctly when providing the category model", async () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());

    expect(attributes).toStrictEqual([
      "category_id",
      "name",
      "description",
      "is_active",
      "created_at",
      "updated_at",
    ]);

    const categoryIdAttr = attributesMap.category_id;
    expect(categoryIdAttr).toMatchObject({
      field: "category_id",
      fieldName: "category_id",
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: "name",
      fieldName: "name",
      type: DataType.STRING(255),
      allowNull: false,
    });

    const descriptionAttr = attributesMap.description;
    expect(descriptionAttr).toMatchObject({
      field: "description",
      fieldName: "description",
      type: DataType.TEXT(),
      allowNull: true,
    });

    const isActiveAttr = attributesMap.is_active;
    expect(isActiveAttr).toMatchObject({
      field: "is_active",
      fieldName: "is_active",
      type: DataType.BOOLEAN(),
      allowNull: false,
    });

    const createdAtAttr = attributesMap.created_at;
    expect(createdAtAttr).toMatchObject({
      field: "created_at",
      fieldName: "created_at",
      type: DataType.DATE(),
      allowNull: false,
    });

    const updatedAtAttr = attributesMap.updated_at;
    expect(updatedAtAttr).toMatchObject({
      field: "updated_at",
      fieldName: "updated_at",
      type: DataType.DATE(),
      allowNull: false,
    });
  });

  test("should create a category when using create method", async () => {
    const data = {
      category_id: "d831edb7-7816-489d-8ecf-4f6365cbec94",
      name: "test",
      is_active: true,
    };

    const category = await CategoryModel.create(data);
    const serializedCategory = category.toJSON();
    delete serializedCategory.updated_at;
    delete serializedCategory.created_at;

    expect(serializedCategory).toStrictEqual(data);
  });

  test("should find a category when using findByPk method", async () => {
    const data: Record<string, unknown> = {
      category_id: "d831edb7-7816-489d-8ecf-4f6365cbec94",
      description: null,
      name: "test",
      is_active: true,
    };

    await CategoryModel.create(data);
    const category = await CategoryModel.findByPk(String(data.category_id));
    const serializedCategory = category.toJSON();
    delete serializedCategory.updated_at;
    delete serializedCategory.created_at;

    expect(serializedCategory).toStrictEqual(data);
  });

  test("should update a category when using update method", async () => {
    const data: Record<string, unknown> = {
      category_id: "d831edb7-7816-489d-8ecf-4f6365cbec94",
      description: null,
      name: "test",
      is_active: true,
    };

    await CategoryModel.create(data);
    let category = await CategoryModel.findByPk(String(data.category_id));
    let serializedCategory = category.toJSON();
    delete serializedCategory.updated_at;
    delete serializedCategory.created_at;

    expect(serializedCategory).toStrictEqual(data);

    data.description =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    await category.update(data);

    category = await CategoryModel.findByPk(String(data.category_id));
    serializedCategory = category.toJSON();
    delete serializedCategory.updated_at;
    delete serializedCategory.created_at;

    expect(serializedCategory).toStrictEqual(data);
  });

  test("should delete a category when using delete method", async () => {
    const data: Record<string, unknown> = {
      category_id: "d831edb7-7816-489d-8ecf-4f6365cbec94",
      description: null,
      name: "test",
      is_active: true,
    };

    await CategoryModel.create(data);
    let category = await CategoryModel.findByPk(String(data.category_id));
    let serializedCategory = category.toJSON();
    delete serializedCategory.updated_at;
    delete serializedCategory.created_at;

    expect(serializedCategory).toStrictEqual(data);

    await category.destroy();

    category = await CategoryModel.findByPk(String(data.category_id));
    expect(category).toBeNull();
  });
});
