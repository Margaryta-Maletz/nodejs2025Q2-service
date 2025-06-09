import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Track } from './track.interface';
import { CreateTrackDto } from './create-track.dto';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class TrackService {
  async getAll(): Promise<Track[]> {
    return prisma.track.findMany();
  }

  async getTrack(id: string): Promise<Track> {
    try {
      return await prisma.track.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  async post(dto: CreateTrackDto): Promise<Track> {
    return prisma.track.create({
      data: { ...dto, favorite: dto.favorite ?? false },
    });
  }

  async put(id, dto: CreateTrackDto): Promise<Track> {
    try {
      await prisma.track.findUniqueOrThrow({
        where: { id },
      });

      return await prisma.track.update({
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
      await prisma.track.findUniqueOrThrow({
        where: { id },
      });

      await prisma.track.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
  }
}
