export interface Connection<T> { edges: { node: T }[] }
export interface Repository {
  id: string; fullName: string; description?: string | null; language?: string | null;
  forksCount?: number | null; stargazersCount?: number | null; ratingAverage: number; reviewCount: number;
  ownerAvatarUrl?: string | null;
}
export interface User { id: string; username: string }
export interface Credentials { username: string; password: string }
