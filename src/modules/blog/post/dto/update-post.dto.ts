import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdatePostDTO {
  @Expose()
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'O título deve ter no máximo 100 caracteres' })
  title: string;

  @Expose()
  @IsString({ message: 'O conteúdo deve ser uma string' })
  @IsNotEmpty({ message: 'O conteúdo é obrigatório' })
  @MinLength(10, { message: 'O conteúdo deve ter no mínimo 10 caracteres' })
  @MaxLength(5000, { message: 'O conteúdo deve ter no máximo 5000 caracteres' })
  content: string;
}
