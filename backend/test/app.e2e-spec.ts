import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

/* -------------------------------------------------------
   SETUP UNTUK SQLITE (TIDAK BOLEH TRUNCATE TABLE)
------------------------------------------------------- */
const createTestApp = async (): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  return app;
};

const cleanDatabase = async (prisma: PrismaService) => {
  const tables = ['FileTag', 'File', 'Tag', 'Folder', 'User'];
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table}";`);
  }
};

/* -------------------------------------------------------
   E2E TEST MULAI
------------------------------------------------------- */
describe('Digital Asset Manager - E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let userId: number;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);

    const user = {
      email: 'test@example.com',
      password: 'password123',
      name: 'TestUser',
    };

    const register = await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(201);

    userId = register.body.id;

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200);

    token = login.body.access_token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  /* -------------------------------------------------------
     AUTH
  ------------------------------------------------------- */
  describe('Auth', () => {
    it('Register user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'new@example.com',
          password: '12345678',
          name: 'New User',
        })
        .expect(201);

      expect(res.body.email).toBe('new@example.com');
    });

    it('Login user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(res.body.access_token).toBeDefined();
    });

    it('Reject login wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong',
        })
        .expect(401);
    });
  });

  /* -------------------------------------------------------
     FOLDER CRUD
  ------------------------------------------------------- */
  describe('Folders', () => {
    it('Create folder', async () => {
      const res = await request(app.getHttpServer())
        .post('/folders')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'MyFolder' })
        .expect(201);

      expect(res.body.name).toBe('MyFolder');
    });

    it('Get folders', async () => {
      await request(app.getHttpServer())
        .post('/folders')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Docs' });

      const res = await request(app.getHttpServer())
        .get('/folders')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.length).toBe(1);
    });
  });

  /* -------------------------------------------------------
     FILE UPLOAD
  ------------------------------------------------------- */
  describe('File Upload', () => {
    it('Upload file', async () => {
      const buffer = Buffer.from('hello');

      const res = await request(app.getHttpServer())
        .post('/files/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', buffer, { filename: 'hello.txt' })
        .expect(201);

      expect(res.body.name).toBe('hello.txt');
    });

    it('Reject upload without auth', async () => {
      const buffer = Buffer.from('test');

      await request(app.getHttpServer())
        .post('/files/upload')
        .attach('file', buffer, { filename: 'x.txt' })
        .expect(401);
    });
  });

  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */
  describe('Search', () => {
    it('Search files by name', async () => {
      await prisma.file.create({
        data: {
          name: 'report.pdf',
          type: 'pdf',
          size: 100,
          path: '/uploads/report.pdf',
          ownerId: userId,
        },
      });

      await prisma.file.create({
        data: {
          name: 'photo.jpg',
          type: 'image',
          size: 200,
          path: '/uploads/photo.jpg',
          ownerId: userId,
        },
      });

      const res = await request(app.getHttpServer())
        .get('/files?search=report')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.length).toBe(1);
    });
  });

  /* -------------------------------------------------------
     TAGS
  ------------------------------------------------------- */
  describe('Tags', () => {
    it('Create tag', async () => {
      const res = await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Important' })
        .expect(201);

      expect(res.body.name).toBe('Important');
    });

    it('Add tag to file', async () => {
      const tag = await prisma.tag.create({
        data: { name: 'Urgent' },
      });

      const file = await prisma.file.create({
        data: {
          name: 'doc.pdf',
          type: 'pdf',
          size: 100,
          path: '/uploads/doc.pdf',
          ownerId: userId,
        },
      });

      const res = await request(app.getHttpServer())
        .post(`/files/${file.id}/tags/${tag.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      expect(res.body.fileId).toBe(file.id);
      expect(res.body.tagId).toBe(tag.id);
    });
  });
});
