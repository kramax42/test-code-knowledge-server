import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { Question, questionSchema } from 'src/models/question.model';
import { QuestionsService } from './questions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { IsCategory } from 'src/libs/validators/category.validator';
import { CategoriesModule } from 'src/modules/categories/categories.module';

@Module({
  controllers: [QuestionsController],
  imports: [
    CategoriesModule,
    MongooseModule.forFeature([
      { name: Question.name, schema: questionSchema },
    ]),
  ],
  providers: [IsCategory, QuestionsService],
})
export class QuestionsModule {}
