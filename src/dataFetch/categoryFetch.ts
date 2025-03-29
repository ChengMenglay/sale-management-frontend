import axiosClient from "@/lib/axios";

export async function getCategories(token: string) {
  try {
    const res = await axiosClient.get(`/category`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function getCategory(token: string, id: string) {
  try {
    const res = await axiosClient.get(`/category/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
}
