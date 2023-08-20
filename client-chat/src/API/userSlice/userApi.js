import { api } from "../api";
import { getChat, select } from "../topSlice/topSlice";
import { Login, Logout, Users } from "./userSlice";

export const userApi = api.injectEndpoints({
    endpoints: build => ({
        Regis: build.mutation({
            query: (body) => ({
                url: '/regis',
                method: "POST",
                body: body
            })
        }),
        Login: build.mutation({
            query: (body) => ({
                url: '/login',
                method: 'POST',
                body: body
            }),
            async onQueryStarted(args, {queryFulfilled, dispatch}){
                try {
                    const {data} = await queryFulfilled

                    localStorage.setItem('refresh', data.token.refresh)
                    localStorage.setItem('access', data.token.access)
                    localStorage.setItem('userUnique', data.userPret.userUnique)
                    console.log(data)

                    dispatch(Users(data.strangers))
                    dispatch(Login(data))
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        Logout: build.query({
            query: () => ({
                url: '/logout',
            }),
            async onQueryStarted(args, {queryFulfilled, dispatch}){
                try {
                    const {data} = await queryFulfilled
                    
                    localStorage.clear()
                    dispatch(Logout())
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        Refresh: build.mutation({
            query: (body) => ({
                url: '/refresh',
                method: 'POST',
                body: body
            }),
            async onQueryStarted(args, {queryFulfilled, dispatch}){
                try {
                    const { data } = await queryFulfilled

                    localStorage.setItem("refresh", data.token.refresh)
                    localStorage.setItem('access', data.token.access)

                    dispatch(Users(data.strangers))
                    dispatch(Login(data))

                    console.log(data)
                    if(data.lastUser){
                        dispatch(select(data.lastUser))
                        dispatch(getChat(data.chatPret))
                    }
                    
                } catch (error) {
                    console.log(error)
                }
            }
        })
    })
})

