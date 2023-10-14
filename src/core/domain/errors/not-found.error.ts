import { Entity } from "../entity";

export class NotFoundError extends Error {
  constructor(
    id: unknown[] | unknown,
    entityCls: new (...args: any[]) => Entity
  ) {
    const ids = Array.isArray(id) ? id.join(", ") : id;
    super(`${entityCls.name} not found using ID ${ids}`);
    this.name = "NotFoundError";
  }
}
