import { Album } from '../album/album.interface';
import { Artist } from '../artist/artist.interface';
import { Favorites } from '../favorites/favorites.interface';
import { Track } from '../track/track.interface';
import { User } from '../user/user.interface';

export const albums: Album[] = [];
export const artists: Artist[] = [];
export const tracks: Track[] = [];
export const users: User[] = [];
export const favorites: Favorites = {
  albums: [],
  artists: [],
  tracks: [],
};
