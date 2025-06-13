import { Test, TestingModule } from '@nestjs/testing';
import { MinegocioService } from './minegocio.service';

describe('MinegocioService', () => {
  let service: MinegocioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinegocioService],
    }).compile();

    service = module.get<MinegocioService>(MinegocioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
