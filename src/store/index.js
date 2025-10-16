import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart/cartSlice";
import userReducer from "./user/userSlice";
import productsReducer from "./products/productsSlice";
import purchaseReducer from "./purchase/purchaseSlice";
import favouritesReducer from "./favourites/favouritesSlice";
import homeScreenReducer from "./homeScreen/homeScreenSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    products: productsReducer,
    purchase: purchaseReducer,
    favourites: favouritesReducer,
    homeScreen: homeScreenReducer,
  },
});

export default store;
