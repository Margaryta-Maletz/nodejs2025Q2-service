import { Module } from '@nestjs/common';
import { FavoritesController } from './favs.controller';
import { FavoritesService } from './favs.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
