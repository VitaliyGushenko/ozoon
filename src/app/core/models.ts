export interface UserProfile {
  email: string;
  isSeller: boolean;
  createdAt: number;
}

export interface Product {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  sellerUid: string;
  createdAt: number;
}
