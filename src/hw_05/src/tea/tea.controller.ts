import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  HttpCode,
  Put,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { TeaService } from './tea.service';
import { ZBody } from '../shared/validators/zbody.validator';
import { CreateTeaDto, CreateTeaDtoSchema } from './dto/create-tea.dto';
import { UpdateTeaDto, UpdateTeaDtoSchema } from './dto/update-tea.dto';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { PublicGuard } from '../shared/guards/public.guard';
import { Public } from 'src/shared/decorators/public.decorator';

import type { TeaEntity } from './entities/tea.entity';

@Controller('tea')
@UseGuards(PublicGuard)
export class TeaController {
  constructor(private teaService: TeaService) {}

  @SkipThrottle()
  @Public()
  @Get('/')
  @HttpCode(200)
  findAll(@Query('minRating') minRating: string): TeaEntity[] {
    return this.teaService.findAll({
      minRating: minRating ? Number(minRating) : undefined,
    });
  }

  @SkipThrottle()
  @Get('/:id')
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    const tea = this.teaService.findOne(id);
    if (!tea) throw new NotFoundException();

    return tea;
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('/')
  @HttpCode(201)
  create(@ZBody(CreateTeaDtoSchema) dto: CreateTeaDto) {
    return this.teaService.create(dto);
  }

  @SkipThrottle()
  @Put('/:id')
  @HttpCode(200)
  update(
    @Param('id') id: string,
    @ZBody(UpdateTeaDtoSchema) dto: UpdateTeaDto,
  ) {
    const tea = this.teaService.findOne(id);
    if (!tea) throw new NotFoundException();

    return this.teaService.update(id, dto);
  }

  @SkipThrottle()
  @Delete('/:id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    const tea = this.teaService.findOne(id);
    if (!tea) throw new NotFoundException();

    return this.teaService.remove(id);
  }
}
