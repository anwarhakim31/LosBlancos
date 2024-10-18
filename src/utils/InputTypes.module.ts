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

export interface inputAddressType {
  userId: string;
  fullname: string;
  phone: string;
  province: {
    id: string;
    name: string;
  };
  city: {
    id: string;
    name: string;
    id_province: string;
  };
  subdistrict: string;
  postalCode: string;
  address: string;
}
