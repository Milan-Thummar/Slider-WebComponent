import { SlideData } from "../../types/types";

export const fetchProduct = async (
  url: string,
  limit: number
): Promise<{ data: SlideData[]; loading: boolean }> => {
  let loading = true;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const products: SlideData[] = data.products.slice(0, limit);
    loading = false;

    return { data: products, loading };
  } catch (error) {
    console.error("Data fetching error:", error);
    loading = false;
    return { data: [], loading };
  }
};
