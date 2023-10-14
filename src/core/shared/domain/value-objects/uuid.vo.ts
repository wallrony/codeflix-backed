import { ValueObject } from "../value-object";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

export class UUID extends ValueObject {
  readonly id: string;

  constructor(id?: string) {
    super();
    this.id = id || uuidv4();
    this.validate();
  }

  private validate() {
    if (!uuidValidate(this.id)) {
      throw new InvalidUUIDError();
    }
  }

  toString() {
    return this.id;
  }
}

export class InvalidUUIDError extends Error {
  constructor(message?: string) {
    super(message || "ID must be a valid UUID!");
    this.name = "InvalidUUIDError";
  }
}
