import { Controller, Get, Param, Post } from '@nestjs/common';
import { PlayerParamsDto } from '../common/dto/player-params.dto';
import { GameService } from './game.service';

@Controller('players/:playerId')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('game/play')
  play(@Param() params: PlayerParamsDto) {
    return this.gameService.play(params.playerId);
  }

  @Get('summary')
  getSummary(@Param() params: PlayerParamsDto) {
    return this.gameService.getPlayerSummary(params.playerId);
  }
}
