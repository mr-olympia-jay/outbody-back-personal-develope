import { Module } from '@nestjs/common';
import { LikesService } from './services/likes.service';
import { LikesController } from './controllers/likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { LikesRepository } from './repositories/likes.repository';
import { PostsRepository } from 'src/posts/repositories/posts.repository';
import { ChallengesRepository } from 'src/challenges/repositories/challenges.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  controllers: [LikesController],
  providers: [
    LikesService,
    LikesRepository,
    PostsRepository,
    ChallengesRepository,
  ],
})
export class LikesModule {}
