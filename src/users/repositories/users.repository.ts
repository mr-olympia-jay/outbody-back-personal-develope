import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Gender, CurrentUser, Status } from '../userInfo';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  //회원가입
  async createUser(
    name: string,
    email: string,
    password: string,
    birthday: string,
    gender: string,
    status: string,
  ): Promise<User> {
    const birthdayDate = new Date(birthday);
    const newUser = this.create({
      name,
      email,
      password,
      birthday: birthdayDate,
      gender: gender as Gender,
      status: status as Status,
    });
    return await this.save(newUser);
  }

  //유저 이메일 조회
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    return user;
  }

  //로그인한 회원 정보조회 ,
  async getCurrentUser(userId: number): Promise<CurrentUser> {
    const queryBuilder = await this.createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.gender',
        'user.birthday',
        'user.comment',
        'user.point',
        'user.password',
      ])
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('user.followers', 'follower')
      .leftJoinAndSelect('follower.followed', 'followed')
      .addSelect(['followed.id', 'followed.name', 'followed.imgUrl']);

    const user = await queryBuilder.getOne();

    const transformedFollowers = user.followers.map((follower) => {
      return {
        id: follower.followed.id,
        name: follower.followed.name,
        imgUrl: follower.followed.imgUrl,
      };
    });

    return {
      id: user.id,
      name: user.name,
      birthday: user.birthday,
      email: user.email,
      password: user.password,
      gender: user.gender,
      comment: user.comment,
      point: user.point,
      followers: transformedFollowers,
    };
  }

  //유저 정보조회
  async getUserById(userId: number): Promise<User> {
    const user = await this.createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.birthday',
        'user.gender',
        'user.height',
        'user.imgUrl',
        'user.comment',
        'user.point',
        'user.email',
      ])
      .where('user.id = :id', { id: userId })
      .getOne();

    return user;
  }

  //유저 정보 수정
  async updateUser(userId: number, imgUrl: string, comment: string) {
    const result = await this.update({ id: userId }, { imgUrl, comment });
    return result;
  }

  // 사용자 점수 수정 (재용)
  async updateUserPoint(userId: number, point: number) {
    const result = await this.update({ id: userId }, { point });
    return result;
  }

  //비밀번호 수정
  async updatePassword(id, newPassword) {
    const result = await this.update({ id }, { password: newPassword });
    return result;
  }

  //회원 탈퇴와 동시에 팔로우 , 팔로잉, 나의 도전 목록들 삭제
  async deleteUser(userId: number): Promise<any> {
    const deleteUserResult = await this.delete({ id: userId });

    return deleteUserResult;
  }
}
