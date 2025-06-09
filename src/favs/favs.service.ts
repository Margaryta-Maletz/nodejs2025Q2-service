import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Favs } from './favs.interface';
import { PrismaClient, Artist, Album, Track } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class FavoritesService {
  async getAll(): Promise<Favs> {
    const albums: Album[] = await prisma.album.findMany({
      where: { favorite: true },
    });
    const artists: Artist[] = await prisma.artist.findMany({
      where: { favorite: true },
    });
    const tracks: Track[] = await prisma.track.findMany({
      where: { favorite: true },
    });

    return {
      albums: albums.map(({ id, name, year, artistId }) => ({
        id,
        name,
        year,
        artistId,
      })),
      artists: artists.map(({ id, name, grammy }) => ({ id, name, grammy })),
      tracks: tracks.map(({ id, name, duration, artistId, albumId }) => ({
        id,
        name,
        duration,
        artistId,
        albumId,
      })),
    };
  }

  async post(entity: string, id: string) {
    try {
      await prisma[entity].update({
        where: { id },
        data: { favorite: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException(
          'Unprocessable entity',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
  }

  async delete(entity: string, id: string) {
    try {
      await prisma[entity].update({
        where: { id },
        data: { favorite: false },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
  }
}
