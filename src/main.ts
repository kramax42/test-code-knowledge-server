import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { useContainer } from 'class-validator';
import { QuestionsModule } from './modules/questions/questions.module';
import { CategoriesModule } from 'src/modules/categories/categories.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // For injecting services in class-validator constraint interface.
  useContainer(app.select(CategoriesModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  // Explanation of problem with CORS.
  // https://tutorialmeta.com/question/nest-js-is-giving-cors-error-even-when-cors-is-enabled
  const whitelist = [
    'http://localhost:3000',
    'http://localhost:8080',
    'https://test-code-knowledge.vercel.app',
    'https://codeteko.vercel.app',
  ];

  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', whitelist.join(','));
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  //   next();
  // });

  app.enableCors({
    // origin: function (origin, callback) {
    //   if (whitelist.indexOf(origin) !== -1) {
    //     console.log('allowed cors for:', origin);
    //     callback(null, true);
    //   } else {
    //     console.log('blocked cors for:', origin);
    //     callback(new Error('Not allowed by CORS'));
    //   }
    //   callback(null, true);
    // },
    origin: whitelist,

    // allowedHeaders:
    //   'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Authorization',
    ],
    // headers exposed to the client
    exposedHeaders: ['Authorization'],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'UPDATE', 'OPTIONS'],
    credentials: true,
  });
  app.use(helmet());
  await app.listen(3010);
}
bootstrap();
