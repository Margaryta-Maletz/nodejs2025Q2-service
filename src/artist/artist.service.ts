import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { albums, artists, tracks } from '../_db/db';
import { Artist } from './artist.interface';
import { CreateArtistDto } from './create-artist.dto';

@Injectable()
export class ArtistService {
  getAll(): Artist[] {
    return artists;
  }

  getArtist(id: string): Artist {
    const current = artists.find((artist) => artist.id === id);
    if (current) {
      return current;
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  post(dto: CreateArtistDto): Artist {
    const { name, grammy } = dto;
    const id = v4();
    const artist = {
      id,
      name,
      grammy,
    };

    artists.push(artist);

    return artist;
  }

  put(id, dto: CreateArtistDto): Artist {
    const index = artists.findIndex((artist) => artist.id === id);
    if (index !== -1) {
      const { name, grammy } = dto;

      artists[index].name = name;
      artists[index].grammy = grammy;

      return artists[index];
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  delete(id: string) {
    const index = artists.findIndex((artist) => artist.id === id);

    if (index !== -1) {
      artists.splice(index, 1);

      tracks.forEach((track) => {
        if (track.artistId === id) {
          track.artistId = null;
        }
      });

      albums.forEach((albym) => {
        if (albym.artistId === id) {
          albym.artistId = null;
        }
      });

      return;
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
}
