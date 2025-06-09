import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Artist } from './artist.interface';
import { CreateArtistDto } from './create-artist.dto';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class ArtistService {
  async getAll(): Promise<Artist[]> {
    return prisma.artist.findMany();
  }

  async getArtist(id: string): Promise<Artist> {
    try {
      return await prisma.artist.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  async post(dto: CreateArtistDto): Promise<Artist> {
    return prisma.artist.create({
      data: { ...dto, favorite: dto.favorite ?? false },
    });
  }

  async put(id, dto: CreateArtistDto): Promise<Artist> {
    try {
      await prisma.artist.findUniqueOrThrow({
        where: { id },
      });

      return await prisma.artist.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  async delete(id: string) {
    try {
      await prisma.artist.findUniqueOrThrow({
        where: { id },
      });

      await prisma.artist.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
  }
}
