import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { StatusCodes } from 'http-status-codes';
import { CreateTrackDto } from './create-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAll() {
    return this.trackService.getAll();
  }

  @Get(':id')
  getArtist(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.trackService.getTrack(id);
  }

  @Post()
  post(
    @Body(new ValidationPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
    dto: CreateTrackDto,
  ) {
    return this.trackService.post(dto);
  }

  @Put(':id')
  put(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
    dto: CreateTrackDto,
  ) {
    return this.trackService.put(id, dto);
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.trackService.delete(id);
  }
}
