import { TypeStock } from "@/services/type.module";

export interface inputProductType {
  name: string;
  description: string;
  price: string;
  image: string[];
  category: string[];
  stock: TypeStock[];
  collectionName: string;
  attribute: string;
}
