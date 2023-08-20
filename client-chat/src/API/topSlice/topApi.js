import { api } from "../api";
import { Login } from "../userSlice/userSlice";
import { getChat, select } from "./topSlice";

export const topApi = api.injectEndpoints({
    endpoints: build => ({
        getChat: build.query({
            query: (params) => ({
                url: `/chat/${params.chatId}`,
            }),
            async onQueryStarted(args, {queryFulfilled, dispatch}){
                try {
                    const { data } = await queryFulfilled

                    localStorage.setItem('refresh', data.token.refresh)
                    localStorage.setItem('access', data.token.access)

                    console.log(data)

                    dispatch(getChat(data.chatPret))
                    dispatch(Login(data))
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        sendMsg: build.mutation({
            query: (params) => ({
                url: `/msg/${params.chatId}`,
                method: 'POST',
                body: params.body
            }),
            async onQueryStarted(args, {queryFulfilled, dispatch}){
                try {
                    const {data} = await queryFulfilled
                    
                    localStorage.setItem('refresh', data.token.refresh)
                    localStorage.setItem('access', data.token.access)
                    console.log('message', data)
                    dispatch(getChat(data.chatPret))
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        deleteMsg: build.mutation({
            query: (params) => ({
                url: `/delete/${params.chatId}/${params.msgId}`,
                method: 'DELETE',
            }),
            async onQueryStarted(args, {queryFulfilled, dispatch}){
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    localStorage.setItem('refresh', data.token.refresh)
                    localStorage.setItem('access', data.token.access)

                    dispatch(getChat(data.chatPret))
                } catch (error) {
                    console.log(error)
                }
            }
        })
    })
})

