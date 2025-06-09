import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from './album.interface';
import { CreateAlbumDto } from './create-album.dto';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class AlbumService {
  async getAll(): Promise<Album[]> {
    return prisma.album.findMany();
  }

  async getAlbum(id: string): Promise<Album> {
    try {
      return await prisma.album.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  async post(dto: CreateAlbumDto): Promise<Album> {
    return prisma.album.create({
      data: { ...dto, favorite: dto.favorite ?? false },
    });
  }

  async put(id, dto: CreateAlbumDto): Promise<Album> {
    try {
      await prisma.album.findUniqueOrThrow({
        where: { id },
      });

      return await prisma.album.update({
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
      await prisma.album.findUniqueOrThrow({
        where: { id },
      });

      await prisma.album.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
  }
}
