import axiosClient from "@/lib/axios";

export const getByOrderId = async (id: number,token:string) => {
  try {
    const res = await axiosClient.get(`/order_details/by-order/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    throw error;
  }
};
