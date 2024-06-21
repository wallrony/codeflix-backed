import * as bcrypt from 'bcrypt';

export class Encrypt {
  static async hash(text: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(text, saltRounds);
  }

  static async compare(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }
}
