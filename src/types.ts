export interface PageInfo { hasNextPage: boolean; endCursor: string | null }
export interface Connection<T> { edges: { node: T; cursor: string }[]; pageInfo: PageInfo; totalCount?: number }
export interface Repository {
  id: string; fullName: string; description?: string | null; language?: string | null;
  forksCount?: number | null; stargazersCount?: number | null; ratingAverage: number; reviewCount: number;
  ownerAvatarUrl?: string | null; url?: string | null; reviews?: Connection<Review>;
}
export interface Review { id: string; text?: string | null; rating: number; createdAt: string; repositoryId: string; user: { id: string; username: string }; repository?: { id: string; fullName: string } }
export interface User { id: string; username: string; reviews?: Connection<Review> }
export interface Credentials { username: string; password: string }
export interface ReviewValues { ownerName: string; repositoryName: string; rating: string; text: string }
export interface SignUpValues extends Credentials { passwordConfirmation: string }
