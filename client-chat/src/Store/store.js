import { configureStore, combineReducers} from "@reduxjs/toolkit";
import { api } from "../API/api";
import userSlice from '../API/userSlice/userSlice'
import topSlice from '../API/topSlice/topSlice'

const rootReducer = combineReducers({
    [api.reducerPath]:api.reducer,
    userSlice,
    topSlice
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(api.middleware)
    }
})

export default store