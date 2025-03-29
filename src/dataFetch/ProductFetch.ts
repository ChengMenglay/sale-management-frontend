import axiosClient from "@/lib/axios";

export const getProducts = async (token: string) => {
  try {
    const res = await axiosClient.get("/product", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log("Error fetching products: ", error);
    throw error;
  }
};

export const getProduct = async (token: string, id: string) => {
  try {
    const res = await axiosClient.get(`/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log("Error fetching a product: ", error);
    throw error;
  }
};

export const filterProduct = async (name: string, token: string) => {
  try {
    const res = await axiosClient.get(`/product?category=${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log("Error fetching a product: ", error);
    throw error;
  }
};
