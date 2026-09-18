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
  /** Все ссылки на изображения; imageUrl — первое из них (для обратной совместимости). */
  images?: string[];
  category: 'phone' | 'laptop';
  /** Фиксированные характеристики. */
  specs: Record<string, string>;
  /** Характеристики, которые покупатель выбирает при покупке: ключ -> доступные значения. */
  variants?: Record<string, string[]>;
  sellerUid: string;
  createdAt: number;
}

/** Данные товара, заполняемые продавцом в форме. */
export type ProductDraft = Pick<
  Product,
  'title' | 'description' | 'category' | 'specs'
> &
  Partial<Pick<Product, 'imageUrl' | 'images' | 'variants'>>;
