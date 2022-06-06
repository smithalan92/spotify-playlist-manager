export interface Playlist {
  id: string;
  href: string;
  image: {
    height: number | undefined;
    width: number | undefined;
    url: string;
  };
  name: string;
  trackCount: number;
  snapshotId: string;
}

export interface User {
  id: string;
  name: string;
}
