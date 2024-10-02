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

export type TypeCategory = {
  _id?: string;
  name: string;
  image: string;
  description: string;
  createdAt?: string;
};
