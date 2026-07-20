// Shared Product type — used across storefront, dashboard, and API routes
// Matches the live Supabase "Product" table schema

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  ingredients?: string[];
  howToUse?: string;
  benefits?: string[];
  weight?: string;
  additionalImages?: string[];
  createdAt?: string;
  updatedAt?: string;
}