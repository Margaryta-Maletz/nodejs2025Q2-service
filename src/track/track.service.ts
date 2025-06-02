import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { favorites, tracks } from 'src/_db/db';
import { v4 } from 'uuid';
import { Track } from './track.interface';
import { CreateTrackDto } from './create-track.dto';

@Injectable()
export class TrackService {
  getAll(): Track[] {
    return tracks;
  }

  getTrack(id: string): Track {
    const current = tracks.find((track) => track.id === id);
    if (current) {
      return current;
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  post(dto: CreateTrackDto): Track {
    const id = v4();

    const track = {
      id,
      ...dto,
    };

    tracks.push(track);

    return track;
  }

  put(id, dto: CreateTrackDto): Track {
    const index = tracks.findIndex((track) => track.id === id);
    if (index !== -1) {
      const { name, artistId, albumId, duration } = dto;

      tracks[index].name = name;
      tracks[index].artistId = artistId;
      tracks[index].albumId = albumId;
      tracks[index].duration = duration;

      return tracks[index];
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  delete(id: string) {
    const index = tracks.findIndex((track) => track.id === id);

    if (index !== -1) {
      tracks.splice(index, 1);

      const ind = favorites.tracks.findIndex((item: string) => item === id);
      if (ind !== -1) {
        favorites.tracks.splice(index, 1);
      }

      return;
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
}
