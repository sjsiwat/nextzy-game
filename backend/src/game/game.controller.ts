import { Controller, Param, Post } from '@nestjs/common';
import { PlayerParamsDto } from '../common/dto/player-params.dto';
import { GameService } from './game.service';

@Controller('players/:playerId/game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('play')
  play(@Param() params: PlayerParamsDto) {
    return this.gameService.play(params.playerId);
  }
}
