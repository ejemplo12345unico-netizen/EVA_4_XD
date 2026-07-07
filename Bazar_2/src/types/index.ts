export const CONTACT_STATUSES = ['Pendiente', 'En revisión', 'Respondido', 'Cerrado'] as const;
export const PRODUCT_CATEGORIES = ['Alimentos', 'Eco', 'Bienestar', 'Libros', 'Otros'] as const;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'Pendiente' | 'En revisión' | 'Respondido' | 'Cerrado';
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}