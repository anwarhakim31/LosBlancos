import instance from "@/utils/axios/instance";

export const wishlistService = {
  getWishlist: async (id: string) => instance.get("/wishlist?user=" + id + ""),
  addWishlist: (user: string, product: string) =>
    instance.post("/wishlist", {
      user,
      product,
    }),
  removeWishlist: (id: string) => instance.delete("/wishlist", { data: id }),
};
