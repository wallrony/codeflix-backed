import { isEqual } from 'lodash';
import { Entity } from '../../../../../domain/entity';
import { NotFoundError } from '../../../../../domain/errors/not-found.error';
import { UUID } from '../../../../domain/value-objects/uuid.vo';
import { InMemoryRepository } from '../in-memory.repository';

type StubEntityConstructor = {
  entityId?: UUID;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entityId: UUID;
  name: string;
  price: number;

  constructor(props: StubEntityConstructor) {
    super();
    this.entityId = props.entityId || new UUID();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON(): Record<string, unknown> {
    return {
      entityId: this.entityId.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<
  StubEntity,
  StubEntity['entityId']
> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('InMemoryRepository Unit Tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it('should insert a new entity', async () => {
    const entity = new StubEntity({ name: 'Test', price: 10 });

    await repository.insert(entity);

    const list = await repository.findAll();
    expect(list.length).toBe(1);
  });

  it('should bulk insert when providing a new entity', async () => {
    const mockedList = [
      new StubEntity({ name: 'Test', price: 10 }),
      new StubEntity({ name: 'Test2', price: 20 }),
    ];

    await repository.bulkInsert(mockedList);
    const list = await repository.findAll();

    expect(list.length).toBe(2);
  });

  it('should list all entities after a bulk insert when using findAll method', async () => {
    const mockedList = [
      new StubEntity({ name: 'Test', price: 10 }),
      new StubEntity({ name: 'Test2', price: 20 }),
    ];
    await repository.bulkInsert(mockedList);

    const list = await repository.findAll();

    expect(list.length).toBe(2);
  });

  it('should find an entity when using findById method', async () => {
    const mockedId = new UUID();
    const entity = new StubEntity({
      entityId: mockedId,
      name: 'Test',
      price: 10,
    });

    await repository.insert(entity);
    const foundEntity = await repository.findById(mockedId);

    expect(foundEntity).toBeDefined();
  });

  it('should throw an error when method findById not found entity', async () => {
    const mockedId = new UUID();
    await expect(repository.findById(mockedId)).rejects.toThrow(
      new NotFoundError(mockedId, StubEntity),
    );
  });

  it('should update an entity when using update method', async () => {
    const mockedId = new UUID();
    const entity = new StubEntity({
      entityId: mockedId,
      name: 'Test',
      price: 10,
    });

    await repository.insert(entity);
    let foundEntity = await repository.findById(mockedId);

    expect(foundEntity).toBeDefined();

    entity.name = 'Test2';
    repository.update(entity);
    foundEntity = await repository.findById(mockedId);

    expect(isEqual(entity, foundEntity)).toBeTruthy();
  });

  it('should throw an error when method findById not found entity', async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 10,
    });
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entityId, StubEntity),
    );
  });

  it('should delete an entity when using delete method', async () => {
    const mockedId = new UUID();
    const entity = new StubEntity({
      entityId: mockedId,
      name: 'Test',
      price: 10,
    });
    await repository.insert(entity);
    let list = await repository.findAll();
    expect(list.length).toBe(1);

    await repository.delete(mockedId);
    list = await repository.findAll();
    expect(list.length).toBe(0);
  });

  it('should throw an error when method findById not found entity', async () => {
    const mockedId = new UUID();
    await expect(repository.delete(mockedId)).rejects.toThrow(
      new NotFoundError(mockedId, StubEntity),
    );
  });
});
