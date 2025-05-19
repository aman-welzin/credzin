import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import cartSlice from './slices/cartSlice'
import bankSlice from './slices/bankSlice';
export const store = configureStore({
  reducer: {
    auth:authSlice,
    cart:cartSlice,
    bank: bankSlice, 

  },
})