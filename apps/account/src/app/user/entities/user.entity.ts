import { UserInterface, UserRole } from '@my-workspace/interfaces';
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

export class UserEntity implements UserInterface {
  _id?: string;
  email: string;
  password: string;
  role: UserRole;

  constructor(partial: Partial<UserEntity>) {
    this._id = partial._id;
    this.email = partial.email;
    this.password = partial.password;
    this.role = partial.role;
  }

  public async setPassword(password: string) {
    const salt = randomBytes(10);

    const passwordHash = (await promisify(scrypt)(
      password,
      salt,
      32
    )) as Buffer;

    this.password = `${salt.toString('base64')}$${passwordHash.toString(
      'base64'
    )}`;

    return this;
  }

  public async validatePassword(password: string) {
    const [salt, hash] = this.password.split('$');

    const passwordHash = (await promisify(scrypt)(
      password,
      Buffer.from(salt, 'base64'),
      32
    )) as Buffer;

    return timingSafeEqual(passwordHash, Buffer.from(hash, 'base64'));
  }
}
