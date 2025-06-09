import { Artist } from '../artist/artist.interface';
import { Album } from '../album/album.interface';
import { Track } from '../track/track.interface';

export interface Favs {
  artists: Omit<Artist, 'favorite'>[];
  albums: Omit<Album, 'favorite'>[];
  tracks: Omit<Track, 'favorite'>[];
}
