import { apiClient } from "@/app/api-client";
import { MessageResponse, SubscriptionStatus } from "./billingType";

export const billingApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionStatus: builder.query<SubscriptionStatus, void>({
      query: () => ({ url: "/billing/subscription", method: "GET" }),
      providesTags: ["billingSubscription"],
    }),
    confirmUpgrade: builder.mutation<MessageResponse, { interval: "monthly" | "yearly" }>({
      query: (body) => ({ url: "/billing/confirm", method: "POST", body }),
      invalidatesTags: ["billingSubscription"],
    }),
    cancelSubscription: builder.mutation<MessageResponse, void>({
      query: () => ({ url: "/billing/cancel", method: "POST" }),
      invalidatesTags: ["billingSubscription"],
    }),
    switchInterval: builder.mutation<MessageResponse, { interval: "monthly" | "yearly" }>({
      query: (body) => ({ url: "/billing/switch-interval", method: "POST", body }),
      invalidatesTags: ["billingSubscription"],
    }),
  }),
});

export const {
  useGetSubscriptionStatusQuery,
  useConfirmUpgradeMutation,
  useCancelSubscriptionMutation,
  useSwitchIntervalMutation,
} = billingApi;
