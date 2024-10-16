import instance from "@/utils/axios/instance";

export interface cartType {
  userId: string;
  productId: string;
  quantity: number;
  atribute: string;
  atributeValue: string;
  price: number;
}

export const cartService = {
  getCart: (id: string) => instance.get("/cart?userId=" + id),
  postCart: (data: cartType) => instance.post("/cart", data),
};
