import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-ip.dto';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  public async signUp({ email, password }: SignUpDto) {
    const candidate = await this.userService.findOneByEmail(email);

    if (candidate) {
      throw new BadRequestException('User already exists');
    }

    const userEntity = await new UserEntity({
      email,
      password,
    }).setPassword(password);

    const user = await this.userService.create(userEntity);

    return user;
  }

  public async signIn(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Wrong login or password');
    }

    const userEntity = new UserEntity(user);

    const isPasswordValid = await userEntity.validatePassword(password);

    if (!isPasswordValid) {
      throw new BadRequestException('Wrong login or password');
    }

    return this.jwtService.signAsync({
      id: user._id,
      email: user.email,
      role: user.role,
    });
  }

  public async getMe(userId: string) {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    delete user.password;

    return user;
  }
}
