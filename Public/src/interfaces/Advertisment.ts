import { User } from "./User";

export interface Category {
  id: number;
  name: string;
  color: string; // Szín, ha szükséges
}

export interface Advertisement {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category; // A kategória most már egy objektum
  imageUrl: string;
  user:User
}
