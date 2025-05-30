import { Test, TestingModule } from '@nestjs/testing';
import { HorariosnegocioService } from './horariosnegocio.service';

describe('HorariosnegocioService', () => {
  let service: HorariosnegocioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HorariosnegocioService],
    }).compile();

    service = module.get<HorariosnegocioService>(HorariosnegocioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
