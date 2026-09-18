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
  category: 'phone' | 'laptop';
  specs: Record<string, string>;
  sellerUid: string;
  createdAt: number;
}
