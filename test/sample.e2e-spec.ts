import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from '@nestjs/testing';
import  request from 'supertest';
import { TestModule } from './test.module';
import { SampleService } from './sample.service';


describe('📌 E2E Tests: SampleController with Mocking', () => {
    let app: INestApplication;
    let sampleService: SampleService;
  
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [TestModule],
      })
        .overrideProvider(SampleService)
        .useValue({
          getData: jest.fn().mockReturnValue(['Mocked data']),
          createData: jest.fn().mockReturnValue({ message: 'Sample data successfully created', name: 'Test Data' }),
        })
        .compile();
  
      app = moduleFixture.createNestApplication();
      sampleService = moduleFixture.get<SampleService>(SampleService);
      await app.init();
    });
  
    afterAll(async () => {
      await app.close();
    });
  
    it('📌 (GET) /sample should return mocked data', async () => {
      const response = await request(app.getHttpServer()).get('/sample');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(['Mocked data']);
    });
  
    it('📌 (POST) /sample should return mocked created data', async () => {
      const sampleData = { name: 'Test Data' };
      const response = await request(app.getHttpServer())
        .post('/sample')
        .send(sampleData);
  
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Sample data successfully created',
        name: 'Test Data',
      });
    });
  });
