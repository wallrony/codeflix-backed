import { Notification } from '../shared/domain/validators/notification';

export abstract class Entity {
  notification: Notification = new Notification();

  abstract toJSON(): Record<string, unknown>;
}
