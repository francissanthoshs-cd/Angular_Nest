import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/DTO/registerUser.dto';
import { UserEntity } from 'src/Entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from 'src/DTO/userLogin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
    private jwt: JwtService,
  ) {}

  async registerUser(registerDto: RegisterUserDto) {
    const { username, password } = registerDto;
    const hashed = await bcrypt.hash(password, 12);
    const salt = await bcrypt.genSalt(12);
    console.log(salt);

    const user = new UserEntity();
    user.username = username;
    user.password = hashed;
    user.salt = salt;

    try {
      return await this.repo.save(user); // Save the user entity with hashed password and salt
    } catch (err) {
      throw new InternalServerErrorException('Something went wrong...');
    }
  }

  async loginUser(userLoginDto: UserLoginDto) {
    const { username, password } = userLoginDto;
    const user = await this.repo.findOneBy({ username });
    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      const jwtPayLoad = { username };
      const jwtToken = await this.jwt.signAsync(jwtPayLoad, {
        expiresIn: '1d',
        algorithm: 'HS512',
      });
      return { token: jwtToken };
    } else throw new UnauthorizedException('Invalid Credentials');
  }
}
