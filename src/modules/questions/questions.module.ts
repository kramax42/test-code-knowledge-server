import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { Question, questionSchema } from 'src/models/question.model';
import { QuestionsService } from './questions.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [QuestionsController],
  imports: [
    MongooseModule.forFeature([{ name: Question.name, schema: questionSchema }]),
  ],
  providers: [QuestionsService],
})
export class QuestionsModule {}
