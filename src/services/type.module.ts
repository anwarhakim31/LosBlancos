export type TypeUser = {
  _id?: string;
  role?: string;
  status?: string;
  fullname?: string;
  email?: string;
  password?: string;
  phone?: number | string;
  jenisKelamin?: string;
  provinsi?: string;
  kota?: string;
  alamat?: string;
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
  description: string;
  price: number | string;
  image: string[];
  stock: TypeStock[];
  category: string[];
  collectionName: TypeCollection;
  createdAt?: string;
  attribute?: string;
  stockAtribut?: TypeStock[];
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
};

export type cartType = {
  _id?: string;
  userId: string;
  items: string[];
  total: number;
};

export type TypeTransaction = {
  _id?: string;
  userId: string;
  items: itemCartType[];
  totalAmount: number;
  address: string;
  statusPayment: string;
  statusTransaction: string;
  createdAt?: string;
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
