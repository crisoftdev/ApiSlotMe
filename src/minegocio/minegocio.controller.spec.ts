import { Test, TestingModule } from '@nestjs/testing';
import { MinegocioController } from './minegocio.controller';

describe('MinegocioController', () => {
  let controller: MinegocioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MinegocioController],
    }).compile();

    controller = module.get<MinegocioController>(MinegocioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
