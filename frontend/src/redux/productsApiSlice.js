import { apiSlice } from "./apiSlice";

const PRODUCTS_URL = "/api/products";

const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: () => PRODUCTS_URL,
    }),
  }),
});

export const { useGetPlansQuery } = productsApiSlice;
