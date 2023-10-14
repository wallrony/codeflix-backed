import { ValueObject } from "../shared/domain/value-object";
import { Notification } from "./validators/notification";

export abstract class Entity {
  notification: Notification = new Notification();

  abstract get entityId(): ValueObject;
  abstract toJSON(): Record<string, unknown>;
}
