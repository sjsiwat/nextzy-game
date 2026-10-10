import { IsUUID } from 'class-validator';

export class PlayerParamsDto {
  @IsUUID()
  playerId: string;
}
