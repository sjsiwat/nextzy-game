import { Type } from 'class-transformer';
import { IsIn } from 'class-validator';
import { PlayerParamsDto } from '../../common/dto/player-params.dto';
import { CHECKPOINT_POINTS } from '../game.constants';

export class ClaimParamsDto extends PlayerParamsDto {
  @Type(() => Number)
  @IsIn(CHECKPOINT_POINTS)
  checkpoint: number;
}
