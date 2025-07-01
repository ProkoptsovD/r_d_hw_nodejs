import { z } from 'zod';
import { CreateTeaDtoSchema } from './create-tea.dto';
import { ApiProperty } from '@nestjs/swagger';

export const UpdateTeaDtoSchema = CreateTeaDtoSchema.partial();
type DTO = z.infer<typeof UpdateTeaDtoSchema>;

export class UpdateTeaDto implements DTO {
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
