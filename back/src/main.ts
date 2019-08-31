import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import * as cluster from 'cluster';
import * as EventEmitter from 'events';

declare const module: any;

const clusterEmitter = new EventEmitter();
const minWorkers = 1;
const workers = {};

const spawnWorker = () => {
  // Fork the process
  const worker = cluster.fork();
  // Store the ID in the map
  workers[worker.id] = worker;
};

clusterEmitter.on('spawnWorker', () => {
  spawnWorker();
});

const spawnWorkers = () => {
  while (Object.keys(workers).length < minWorkers) {
    clusterEmitter.emit('spawnWorker');
  }
};

if (cluster.isWorker) {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
    app.use(compression());
    app.use(helmet());
    app.enableCors();

    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
      next();
    });

    app.use(
      rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minutes
        max: 1000, // limit each IP to 1000 requests per windowMs
      }),
    );

    const options = new DocumentBuilder()
      .setTitle('i18n Back')
      .setDescription('Back of i18n')
      .setVersion('1.0')
      .addTag('language')
      .addTag('translation')
      .build();

    const swaggerOptions = {
      explorer: true,
    };

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document, swaggerOptions);

    await app.listen(3000);

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }

    app.use(csurf());
  }

  bootstrap();
} else {
  spawnWorkers();
}

// Listen for dying workers
cluster.on('exit', (worker) => {
  delete workers[worker.id];
  spawnWorkers();
});

