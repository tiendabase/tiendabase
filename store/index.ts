import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";

import cartReducer from "./reducers/cart";
import userReducer from "./reducers/user";

// COMBINA LOS REDUCERS
const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
});

export type RootReducerType = typeof rootReducer;

// EXPORTA REDUCER
export { rootReducer };

// Crea la store
export const makeStore = ({ isServer }: { isServer: boolean }) => {
  if (isServer) {
    return configureStore({
      reducer: rootReducer,
     
    });
  } else {
    const persistConfig = {
      key: "shoppingcart",
      whitelist: ["cart", "user"],
      storage,
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    return configureStore({
      reducer: persistedReducer,
       middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            // 👇 ignora acciones internas de redux-persist
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
    });
  }
};

// EXPORTA RootState con un truco:
const testStore = makeStore({ isServer: false }); // simulamos que estamos en cliente
export type RootState = ReturnType<typeof testStore.getState>;
export type AppDispatch = typeof testStore.dispatch;
