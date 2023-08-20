import {
  Injectable,
  NotFoundException,
  ConflictException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/users.repository';
import { UserCreateDto } from '../dto/users.create.dto';
import * as bcrypt from 'bcrypt';
import { UserUpdateDto } from '../dto/users.update.dto';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  //회원가입
  async createUser(user: UserCreateDto) {
    const { name, email, password, age, height, gender } = user;
    const existUser = await this.usersRepository.getUserByEmail(email);

    if (existUser) {
      throw new ConflictException('이미 존재하는 유저입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    const createUserResult = await this.usersRepository.createUser(
      name,
      email,
      hashedPassword,
      age,
      height,
      gender,
    );

    return createUserResult;
  }

  //로그인 한 유저 정보조회
  async getCurrentUserById(userId: number) {
    const getUser = await this.usersRepository.getCurrentUserById(userId);
    if (!getUser) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return getUser;
  }

  //사용자 정보조회
  async getUserById(userId: number) {
    const getUser = await this.usersRepository.getUserById(userId);
    if (!getUser) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return getUser;
  }

  //유저 정보 수정
  async updateUser(userId: number, userDto: UserUpdateDto) {
    const { age, height, gender, password, newPassword } = userDto;
    const user = await this.getCurrentUserById(userId);
    if (!user) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }

    const comparedHash = await bcrypt.compare(password, user.password);
    if (!comparedHash) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const updateUser = await this.usersRepository.updateUser(
      userId,
      age,
      height,
      gender,
      newPassword,
    );

    if (!updateUser) {
      throw new NotImplementedException('업데이트에 실패했습니다');
    }

    return updateUser;
  }

  //회원탈퇴
  async deletUser(userId: number): Promise<any> {
    const result = await this.usersRepository.deleteUser(userId);

    if (!result) {
      throw new NotImplementedException('해당 작업을 완료하지 못했습니다');
    }

    return result;
  }
}