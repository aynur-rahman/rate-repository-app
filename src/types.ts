export interface Repository {
  id: string; fullName: string; description?: string | null; language?: string | null;
  forksCount?: number | null; stargazersCount?: number | null; ratingAverage: number; reviewCount: number;
  ownerAvatarUrl?: string | null;
}
export interface Credentials { username: string; password: string }
