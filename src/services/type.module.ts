export interface TypeUser {
  _id?: string;
  role?: string;
  status?: string;
  fullname?: string;
  email?: string;
  password?: string;
  phone?: number | string;
  gender?: string;
  createdAt?: string;
  image?: string;
}

export interface TypeCollection {
  _id?: string;
  name: string;
  image: string;
  description: string;
  slug: string;
  createdAt?: string;
}

export interface TypeCategory {
  _id?: string;
  name: string;
  createdAt?: string;
}

export interface TypeCarousel {
  _id?: string;
  image: string;
  title: string;
  url: string;
  description: string;
  caption: string;
  createdAt?: string;
}

export interface TypeMarquee {
  _id?: string;
  display: boolean;
  image: string[];
}

export interface TypeMaster {
  _id?: string;
  logo?: string;
  displayLogo?: boolean;
  name?: string;
  color?: string;
  displayName?: boolean;
  favicon?: string;
  description?: string;
  email?: string;
  phone?: string;
  googleMap?: string;
  banner?: string;
  youtube?: string;
  about?: string;
  address?: {
    street: string;
    postalCode: string;
    city: string;
    province: string;
    subdistrict: string;
  };
  media?: {
    name: string;
    url: string;
  }[];
}

export interface TypeAttribute {
  _id?: string;
  name?: string;
  value?: string[];
}

export interface TypeProduct {
  _id?: string;
  name: string;
  sold?: number;
  description: string;
  price: number | string;
  image: string[];
  stock: TypeStock[];
  category: string[];
  collectionName: TypeCollection;
  createdAt?: string;
  attribute?: string;
  stockAtribut?: TypeStock[];
  averageRating?: number;
  reviewCount?: number;
  weight: number;
}

export interface TypeStock {
  _id?: string;
  attribute: string;
  value: string;
  stock: number;
}

export interface TypeWishlist {
  _id?: string;
  user: string;
  product: TypeProduct;
}

export interface itemCartType {
  _id?: string;
  product: TypeProduct;
  quantity: number;
  price: number;
  atribute: string;
  atributeValue: string;
  weight: number;
}

export interface cartType {
  _id?: string;
  userId: string;
  items: string[];
  total: number;
}

export interface itemTypeTransaction {
  _id?: string;
  productId: TypeProduct;
  quantity: number;
  price: number;
  atribute: string;
  atributeValue: string;
  weight: number;
}

export interface TypeTransaction {
  _id?: string;
  expired: Date;
  invoice: string;
  userId: TypeUser;
  items: itemTypeTransaction[];
  shippingAddress?: {
    fullname: string;
    phone: string;
    province: string;
    city: string;
    subdistrict: string;
    postalCode: string;
    address: string;
  };
  diskon: number;
  paymentMethod?: string;
  paymentCode?: string;
  paymentName?: string;
  paymentCreated?: Date;
  paymentExpired?: Date;
  paymentStatus?: string;
  subtotal: number;
  shippingName: string;
  shippingCost: number;
  totalPayment: number;
  address: string;
  statusPayment: string;
  transactionStatus: string;
  transactionDate: Date;
}

export interface TypeShippingAddress {
  _id?: string;
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

export interface TypeOngkir {
  service: string;
  description: string;
  courier: string;
  cost: [
    {
      value: number;
      etd: string;
      note: string;
    }
  ];
}

export interface TypeReview {
  _id?: string;
  transactionId: string;
  itemId: string;
  product: TypeProduct | string;
  user: TypeUser;
  comment: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}
