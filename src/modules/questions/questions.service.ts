import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { categories } from 'src/libs/constants/categories.constants';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { Question } from 'src/models/question.model';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: ModelType<Question>) { }

  async findAll(
    category: string,
    skip = 0,
    limit?: number,
  ) {
    const findQuery = this.questionModel
      .find({ category })
      .sort({ _id: 1 })
      .skip(skip);

    if (limit) {
      findQuery.limit(limit);
    }

    const foundQuestions = await findQuery;

    return foundQuestions;
  }

  async findRandom(
    category: string,
    limit: number,
  ): Promise<Question[]> {
    const randomQuestions = await this.questionModel.aggregate([
      { $match: { category } },
      { $sample: { size: limit } }
    ]).exec()


    return randomQuestions;
  }

  async create(dto: CreateQuestionDto) {
    return this.questionModel.create(dto);
  }

  async findById(id: string) {
    return this.questionModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.questionModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: UpdateQuestionDto) {
    return this.questionModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async getCategoriesSizes() {
    const categoriesObj: Record<string, number> = {};

    //https://advancedweb.hu/how-to-use-async-functions-with-array-map-in-javascript/
    await Promise.all(categories.map(async (category) => {
      categoriesObj[category] = await this.questionModel.countDocuments({ category });
    }))
    return categoriesObj;
  }
}
