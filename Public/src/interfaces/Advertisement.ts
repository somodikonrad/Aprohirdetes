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
  user: {
    id: number;
    name: string;
    email: string;
    address: string;
  };
}
