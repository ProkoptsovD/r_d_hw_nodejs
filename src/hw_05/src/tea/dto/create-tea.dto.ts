import { z } from 'zod';
import { TeaSchema } from '../entities/tea.entity';
import { ApiProperty } from '@nestjs/swagger';

export const CreateTeaDtoSchema = TeaSchema.omit({ id: true });
type DTO = z.infer<typeof CreateTeaDtoSchema>;

export class CreateTeaDto implements DTO {
  @ApiProperty({ example: 'John Doe' })
  name: DTO['name'];

  @ApiProperty({ example: 'China' })
  origin: DTO['origin'];

  @ApiProperty({ example: 80 })
  brewTemp: DTO['brewTemp'];

  @ApiProperty({ example: 'The tea I bought last month' })
  notes: DTO['notes'];

  @ApiProperty({ example: 4 })
  rating: DTO['rating'];
}
