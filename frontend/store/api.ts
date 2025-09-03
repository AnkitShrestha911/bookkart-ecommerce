import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const API_URLS = {
	// user related urls
	REGISTER: `${BASE_URL}/auth/register`,
	LOGIN: `${BASE_URL}/auth/login`,
	VERIFY_EMAIL: (token: string) => `${BASE_URL}/auth/verify-email/${token}`,
	FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
	RESET_PASSWORD: (token: string) => `${BASE_URL}/auth/reset-password/${token}`,
	LOGOUT: `${BASE_URL}/auth/logout`,
	VERIFY_AUTH: `${BASE_URL}/auth/verify-auth`,
	UPDATE_USER_PROFILE: (userId: string) => `${BASE_URL}/user/profile/update/${userId}`,
	CHECK_LOGIN: `${BASE_URL}/auth/check-login`,

	// Product related urls

	CREATE_PRODUCT: `${BASE_URL}/products`,
	GET_ALL_PRODUCTS: `${BASE_URL}/products`,
	PRODUCT_BY_ID: (productId: string) => `${BASE_URL}/products/${productId}`,
	DELETE_PRODUCT_BY_SELLER_ID: (productId: string) => `${BASE_URL}/products/seller/${productId}`,
	GET_PRODUCT_BY_SELLER_ID: (sellerId: string) => `${BASE_URL}/products/seller/${sellerId}`,

	// cart related urls

	ADD_TO_CART: `${BASE_URL}/cart/add`,
	GET_CART_BY_USER_ID: (userId: string) => `${BASE_URL}/cart/${userId}`,
	DECREMENT_FROM_CART: (productId: string) => `${BASE_URL}/cart/${productId}/decrement`,
	REMOVE_FROM_CART: (productId: string) => `${BASE_URL}/cart/remove/${productId}`,


	// wishlist related urls

	ADD_TO_WISHLIST: `${BASE_URL}/wishlist/add`,
	GET_WISHLIST_BY_USER_ID: (userId: string) => `${BASE_URL}/wishlist/single/${userId}`,
	GET_ALL_WISHLIST_BY_USER_ID: (userId: string) => `${BASE_URL}/wishlist/all/${userId}`,
	FIND_PRODUCT_IN_WISHLIST: (productId: string) => `${BASE_URL}/wishlist/find/${productId}`,
	REMOVE_FROM_WISHLIST: (productId: string) => `${BASE_URL}/wishlist/remove/${productId}`,

	// order related urls

	CREATE_ORDER: `${BASE_URL}/orders`,
	GET_USER_ORDER: `${BASE_URL}/orders`,
	GET_ORDER_BY_ID: (orderId: string) => `${BASE_URL}/orders/${orderId}`,
	CREATE_RAZORPAY_PAYMENT: `${BASE_URL}/orders/razorpay-payment`,

	// address related urls

	CREATE_OR_UPDATE_ADDRESS: `${BASE_URL}/user/address/save`,
	GET_ADDRESS: `${BASE_URL}/user/address`,
};

export const api = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
		credentials: "include",
	}),
	tagTypes: ["User", "Product", "Cart", "Wishlist", "Order", "Address"],
	endpoints: (builder) => ({
		// user endpoints
		register: builder.mutation({
			query: (userData) => ({
				url: API_URLS.REGISTER,
				method: "POST",
				body: userData,
			}),
		}),

		login: builder.mutation({
			query: (userData) => ({
				url: API_URLS.LOGIN,
				method: "POST",
				body: userData,
			}),
		}),

		verifyEmail: builder.mutation({
			query: (token) => ({
				url: API_URLS.VERIFY_EMAIL(token),
				method: "GET",
			}),
		}),

		forgotPassword: builder.mutation({
			query: (email) => ({
				url: API_URLS.FORGOT_PASSWORD,
				method: "POST",
				body: { email },
			}),
		}),

		resetPassword: builder.mutation({
			query: ({ token, newPassword }) => ({
				url: API_URLS.RESET_PASSWORD(token),
				method: "POST",
				body: { newPassword },
			}),
		}),

		verifyAuth: builder.mutation({
			query: () => ({
				url: API_URLS.VERIFY_AUTH,
				method: "GET",
			}),
		}),

		logout: builder.mutation({
			query: () => ({
				url: API_URLS.LOGOUT,
				method: "GET",
			}),
		}),

		checkLogin: builder.mutation({
			query: () => ({
				url: API_URLS.CHECK_LOGIN,
				method: "GET",
			}),
		}),

		updateUserProfile: builder.mutation({
			query: ({ userId, userData }) => ({
				url: API_URLS.UPDATE_USER_PROFILE(userId),
				method: "PATCH",
				body: userData,
			}),
		}),

		// products endpoints

		createProduct: builder.mutation({
			query: (productData) => ({
				url: API_URLS.CREATE_PRODUCT,
				method: "POST",
				body: productData,
			}),
			invalidatesTags: ["Product"],
		}),

		getAllProducts: builder.query({
			query: () => ({
				url: API_URLS.GET_ALL_PRODUCTS,
			}),
			providesTags: ["Product"],
		}),

		getProductById: builder.query({
			query: (productId) => ({
				url: API_URLS.PRODUCT_BY_ID(productId),
			}),
			providesTags: ["Product"],
		}),

		getProductBySellerId: builder.query({
			query: (sellerId) => ({
				url: API_URLS.GET_PRODUCT_BY_SELLER_ID(sellerId),
			}),
			providesTags: ["Product"],
		}),

		deleteProductBySellerId: builder.mutation({
			query: (productId) => ({
				url: API_URLS.DELETE_PRODUCT_BY_SELLER_ID(productId),
				method: "DELETE",
			}),
			invalidatesTags: ["Product"],
		}),

		// cart endpoints

		addToCart: builder.mutation({
			query: (productData) => ({
				url: API_URLS.ADD_TO_CART,
				method: "POST",
				body: productData,
			}),
			invalidatesTags: ["Cart"],
		}),

		getCartByUserId: builder.query({
			query: (userId) => ({
				url: API_URLS.GET_CART_BY_USER_ID(userId),
			}),
			providesTags: ["Cart"],
		}),

		decrementFromCart: builder.mutation({
			query: (productId) => ({
				url: API_URLS.DECREMENT_FROM_CART(productId),
				method: "PATCH",
			}),
			invalidatesTags: ["Cart"],
		}),

		

		removeFromCart: builder.mutation({
			query: (productId) => ({
				url: API_URLS.REMOVE_FROM_CART(productId),
				method: "DELETE",
			}),
			invalidatesTags: ["Cart"],
		}),

		// wishlist endpoints

		addToWishList: builder.mutation({
			query: (productId) => ({
				url: API_URLS.ADD_TO_WISHLIST,
				method: "POST",
				body: { productId },
			}),
			invalidatesTags: ["Wishlist"],
		}),

		getWishListByUserId: builder.query({
			query: (userId) => ({
				url: API_URLS.GET_WISHLIST_BY_USER_ID(userId),
			}),
			providesTags: ["Wishlist"],
		}),

		getAllWishListByUserId: builder.query({
			query: (userId) => ({
				url: API_URLS.GET_ALL_WISHLIST_BY_USER_ID(userId),
			}),
			providesTags: ["Wishlist"],
		}),

		findProductInWishList: builder.query({
			query: (productId) => ({
				url: API_URLS.FIND_PRODUCT_IN_WISHLIST(productId),
			}),
			providesTags: ["Wishlist"],
		}),

		removeFromWishList: builder.mutation({
			query: (productId) => ({
				url: API_URLS.REMOVE_FROM_WISHLIST(productId),
				method: "DELETE",
			}),
			invalidatesTags: ["Wishlist"],
		}),

		// order endpoints

		createOrder: builder.mutation({
			query: ({ orderId, updates }) => ({
				url: API_URLS.CREATE_ORDER,
				method: orderId ? "PATCH" : "POST",
				body: updates,
			}),
			invalidatesTags: ["Order"],
		}),

		getUserOrder: builder.query({
			query: () => ({
				url: API_URLS.GET_USER_ORDER,
			}),
			providesTags: ["Order"],
		}),

		getOrderById: builder.query({
			query: (orderId) => ({
				url: API_URLS.GET_ORDER_BY_ID(orderId),
			}),
			providesTags: ["Order"],
		}),

		createRazorpayPayment: builder.mutation({
			query: (orderId) => ({
				url: API_URLS.CREATE_RAZORPAY_PAYMENT,
				method: "POST",
				body: { orderId },
			}),
			invalidatesTags: ["Order"],
		}),

		// address endpoints

		createOrUpdateAddress: builder.mutation<any, any>({
			query: (addressDetails) => ({
				url: API_URLS.CREATE_OR_UPDATE_ADDRESS,
				method: "POST",
				body: addressDetails,
			}),
			invalidatesTags: ["Address"],
		}),

		getAddress: builder.query<any[], void>({
			query: () => ({
				url: API_URLS.GET_ADDRESS,
			}),
			providesTags: ["Address"],
		}),
	}),
});

export const {
	useRegisterMutation,
	useLoginMutation,
	useVerifyEmailMutation,
	useForgotPasswordMutation,
	useResetPasswordMutation,
	useVerifyAuthMutation,
	useLogoutMutation,
	useUpdateUserProfileMutation,
	useCreateProductMutation,
	useGetAllProductsQuery,
	useGetProductByIdQuery,
	useGetProductBySellerIdQuery,
	useDeleteProductBySellerIdMutation,
	useAddToCartMutation,
	useGetCartByUserIdQuery,
	useDecrementFromCartMutation,
	useRemoveFromCartMutation,
	useAddToWishListMutation,
	useGetWishListByUserIdQuery,
	useRemoveFromWishListMutation,
	useCreateOrderMutation,
	useGetUserOrderQuery,
	useGetOrderByIdQuery,
	useCreateRazorpayPaymentMutation,
	useCreateOrUpdateAddressMutation,
	useGetAddressQuery,
	useFindProductInWishListQuery,
	useCheckLoginMutation,
	useGetAllWishListByUserIdQuery,
} = api;
