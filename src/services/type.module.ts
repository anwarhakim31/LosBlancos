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
  collectionName: string;
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
