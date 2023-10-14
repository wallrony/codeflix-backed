import { FieldErrors } from "./validator-fields-interface";

export class ValidationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ValidationError";
  }

  getMessage(): string {
    return this.message;
  }
}

export class EntityValidationError extends Error {
  constructor(public errors: FieldErrors, message = "Validation Error") {
    super(message);
  }

  count() {
    return Object.keys(this.errors).length;
  }
}
