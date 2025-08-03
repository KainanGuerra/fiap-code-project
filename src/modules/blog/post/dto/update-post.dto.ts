import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

@Exclude()
export class UpdatePostDTO {
  @ApiProperty({
    description: 'Title of the post',
    example: 'How to use NestJS with Swagger',
    minLength: 3,
    maxLength: 100,
  })
  @Expose()
  @IsOptional()
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'O título deve ter no máximo 100 caracteres' })
  title?: string;

  @ApiProperty({
    description: 'Content of the post',
    example: 'NestJS provides great support for decorators...',
    minLength: 10,
    maxLength: 5000,
  })
  @Expose()
  @IsOptional()
  @IsString({ message: 'O conteúdo deve ser uma string' })
  @IsNotEmpty({ message: 'O conteúdo é obrigatório' })
  @MinLength(10, { message: 'O conteúdo deve ter no mínimo 10 caracteres' })
  @MaxLength(5000, { message: 'O conteúdo deve ter no máximo 5000 caracteres' })
  content?: string;
}
