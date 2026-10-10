import { Controller, Get, Param } from '@nestjs/common';
import { PlayerParamsDto } from '../common/dto/player-params.dto';
import { HistoryService } from './history.service';

@Controller('players/:playerId/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('plays')
  getPlays(@Param() params: PlayerParamsDto) {
    return this.historyService.getPlays(params.playerId);
  }

  @Get('rewards')
  getRewards(@Param() params: PlayerParamsDto) {
    return this.historyService.getRewards(params.playerId);
  }
}
