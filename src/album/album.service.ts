import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from './album.interface';
import { albums } from 'src/_db/db';
import { CreateAlbumDto } from './create-album.dto';
import { v4 } from 'uuid';

@Injectable()
export class AlbumService {
  getAll(): Album[] {
    return albums;
  }

  getAlbum(id: string): Album {
    const current = albums.find((album) => album.id === id);
    if (current) {
      return current;
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  post(dto: CreateAlbumDto): Album {
    const { name, year, artistId } = dto;
    const id = v4();

    const album = {
      id,
      name,
      year,
      artistId,
    };

    albums.push(album);

    return album;
  }

  put(id, dto: CreateAlbumDto): Album {
    const index = albums.findIndex((album) => album.id === id);
    if (index !== -1) {
      const { name, year, artistId } = dto;

      albums[index].name = name;
      albums[index].year = year;
      albums[index].artistId = artistId;

      return albums[index];
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  delete(id: string) {
    const index = albums.findIndex((album) => album.id === id);

    if (index !== -1) {
      albums.splice(index, 1);
      return;
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
}
