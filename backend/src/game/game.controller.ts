import { Controller, Get, Param, Post } from '@nestjs/common';
import { PlayerParamsDto } from '../common/dto/player-params.dto';
import { GameService } from './game.service';
import { ClaimParamsDto } from './dto/claim-params.dto';

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

  @Post('rewards/:checkpoint/claim')
  claimReward(@Param() params: ClaimParamsDto) {
    return this.gameService.claimReward(params.playerId, params.checkpoint);
  }
}
