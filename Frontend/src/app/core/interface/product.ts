export interface Product {
  id?: number;
  name: string;
  slug:string;
  description?: string;
  price: number;
  stock?: number;
  category_id: number;
  main_image?: string; // ✅ SOLO para mostrar
}
