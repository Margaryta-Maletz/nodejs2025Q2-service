import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { albums, artists, favorites, tracks } from '../_db/db';
import { Favs } from './favs.interface';

@Injectable()
export class FavoritesService {
  private getEntityArray(entity: string) {
    if (entity === 'album') {
      return albums;
    }

    if (entity === 'artist') {
      return artists;
    }

    if (entity === 'track') {
      return tracks;
    }

    return [];
  }

  getAll(): Favs {
    return {
      albums: favorites.albums.map((id) =>
        albums.find((item) => item.id === id),
      ),
      artists: favorites.artists.map((id) =>
        artists.find((item) => item.id === id),
      ),
      tracks: favorites.tracks.map((id) =>
        tracks.find((item) => item.id === id),
      ),
    };
  }

  post(entity: string, id: string) {
    const entityArray = this.getEntityArray(entity);
    const index = entityArray.findIndex((item) => item.id === id);

    if (index !== -1) {
      favorites[`${entity}s`].push(entityArray[index].id);

      return;
    }

    throw new HttpException(
      'Unprocessable entity',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  delete(entity: string, id: string) {
    const index = favorites[`${entity}s`].findIndex(
      (item: string) => item === id,
    );

    if (index !== -1) {
      favorites[`${entity}s`].splice(index, 1);

      return;
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
}
