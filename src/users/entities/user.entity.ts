import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Gender, Provider } from '../userInfo';
import { RecordEntity } from 'src/recodes/recodes.entity';
import { FollowEntity } from './follow.entity';
import { ReportEntity } from './report.entity';

@Entity({ schema: 'outbody', name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userId' })
  id: number;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('int', { nullable: true })
  age: number;

  @Column('int', { nullable: true })
  height: number;

  @Column('varchar', { length: 60 })
  email: string;

  @Column('varchar', { length: 100, nullable: true })
  password: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'enum', enum: Provider, default: Provider.LOCAL })
  provider: Provider;

  @Column('varchar', { nullable: true })
  imgUrl: string;

  @Column('int', { nullable: true })
  point: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => RecordEntity, (record) => record.user)
  records: RecordEntity[];

  @OneToMany(() => FollowEntity, (following) => following.follower)
  @JoinColumn({ name: 'followingUserId' })
  followings: FollowEntity[];

  @OneToMany(() => FollowEntity, (followed) => followed.followedUser)
  @JoinColumn({ name: 'followedUserId' })
  followeds: FollowEntity[];

  @OneToMany(() => ReportEntity, (reporting) => reporting.reporter)
  @JoinColumn({ name: 'reporterId' })
  reportings: ReportEntity[];

  @OneToMany(() => ReportEntity, (reported) => reported.reportedUser)
  @JoinColumn({ name: 'reportedUserId' })
  reporteds: ReportEntity[];
}