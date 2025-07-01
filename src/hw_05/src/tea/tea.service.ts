import { Injectable } from '@nestjs/common';
import { CreateTeaDto } from './dto/create-tea.dto';
import { UpdateTeaDto } from './dto/update-tea.dto';

import type { TeaEntity } from './entities/tea.entity';

@Injectable()
export class TeaService {
  private teas: TeaEntity[] = [];

  constructor() {}
  create(createTeaDto: CreateTeaDto): TeaEntity {
    const newTea: TeaEntity = {
      id: String(Date.now()),
      ...createTeaDto,
    };
    this.teas.push(newTea);
    return newTea;
  }

  findAll(query: { minRating?: number }): TeaEntity[] {
    if (query?.minRating) {
      return this.teas.filter(
        (tea) => tea.rating && tea.rating >= query.minRating!,
      );
    }
    return this.teas;
  }

  findOne(id: string): TeaEntity | undefined {
    return this.teas.find((tea) => tea.id === id);
  }

  update(id: string, updateTeaDto: UpdateTeaDto): TeaEntity | undefined {
    const teaIndex = this.teas.findIndex((tea) => tea.id === id);
    if (teaIndex === -1) {
      return undefined;
    }
    this.teas[teaIndex] = {
      ...this.teas[teaIndex],
      ...updateTeaDto,
    } as TeaEntity;

    return this.teas[teaIndex];
  }

  remove(id: string): boolean {
    const teaIndex = this.teas.findIndex((tea) => tea.id === id);
    if (teaIndex === -1) {
      return false;
    }
    this.teas.splice(teaIndex, 1);
    return true;
  }
}
