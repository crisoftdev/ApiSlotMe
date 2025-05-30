import { Test, TestingModule } from '@nestjs/testing';
import { HorariosnegocioController } from './horariosnegocio.controller';

describe('HorariosnegocioController', () => {
  let controller: HorariosnegocioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HorariosnegocioController],
    }).compile();

    controller = module.get<HorariosnegocioController>(HorariosnegocioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
