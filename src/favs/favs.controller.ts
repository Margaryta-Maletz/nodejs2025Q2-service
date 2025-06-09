import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { FavoritesService } from './favs.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getHello() {
    return this.favoritesService.getAll();
  }

  @Post(':entity/:id')
  post(
    @Param('entity') entity: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.favoritesService.post(entity, id);
  }

  @Delete(':entity/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  delete(
    @Param('entity') entity: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.favoritesService.delete(entity, id);
  }
}
