export type TypeUser = {
  _id?: string;
  role?: string;
  status?: string;
  fullname?: string;
  email?: string;
  password?: string;
  phone?: number | string;
  gender?: string;
  createdAt?: string;
};

export type TypeCollection = {
  _id?: string;
  name: string;
  image: string;
  description: string;
  slug: string;
  createdAt?: string;
};

export type TypeCategory = {
  _id?: string;
  name: string;
  createdAt?: string;
};

export type TypeCarousel = {
  _id?: string;
  image: string;
  title: string;
  url: string;
  description: string;
  caption: string;
  createdAt?: string;
};

export type TypeMarquee = {
  _id?: string;
  display: boolean;
  image: string[];
};

export type TypeMaster = {
  _id?: string;
  logo?: string;
  displayLogo?: boolean;
  name?: string;
  color?: string;
  displayName?: boolean;
  favicon?: string;
  description?: string;
};

export type TypeAttribute = {
  _id?: string;
  name?: string;
  value?: string[];
};

export type TypeProduct = {
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
};

export type TypeStock = {
  _id?: string;
  attribute: string;
  value: string;
  stock: number;
};

export type TypeWishlist = {
  _id?: string;
  user: string;
  product: TypeProduct;
};

export type itemCartType = {
  _id?: string;
  product: TypeProduct;
  quantity: number;
  price: number;
  atribute: string;
  atributeValue: string;
  weight: number;
};

export type cartType = {
  _id?: string;
  userId: string;
  items: string[];
  total: number;
};

export type itemTypeTransaction = {
  _id?: string;
  productId: TypeProduct;
  quantity: number;
  price: number;
  atribute: string;
  atributeValue: string;
  weight: number;
};

export type TypeTransaction = {
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
};

export type TypeShippingAddress = {
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
};

export type TypeOngkir = {
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
};

export type TypeReview = {
  _id?: string;
  transactionId: string;
  itemId: string;
  product: TypeProduct | string;
  user: TypeUser | string;
  comment: string;
  rating: number;
};
