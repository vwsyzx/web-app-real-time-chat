import { api } from "../api";
import { select } from "../topSlice/topSlice";
import { Back, Login, Users } from "../userSlice/userSlice";

export const middleApi = api.injectEndpoints({
    endpoints: build => ({
        Request: build.mutation({
            query: (body) => ({
                url: '/request',
                method: "POST",
                body: body
            }),
            async onQueryStarted(args, {queryFulfilled, dispatch}){
                try {
                    const { data } = await queryFulfilled

                    localStorage.setItem('refresh', data.token.refresh)
                    localStorage.setItem('access', data.token.access)

                    dispatch(Login(data))
                } catch (error) {
                    console.log(error)
                }
            }

        }),
        Accept: build.mutation({
            query: (body) => ({
                url: '/accept',
                method: "POST",
                body: body
            }),
            async onQueryStarted(args, {queryFulfilled, dispatch}){
                try {
                    const { data } = await queryFulfilled

                    localStorage.setItem('refresh', data.token.refresh)
                    localStorage.setItem('access', data.token.access)

                    dispatch(Login(data))
                    dispatch(Users(data.strangers))
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        Reject: build.query({
            query: (params) => ({
                url: `/reject/${params.unique}`
            }),
            async onQueryStarted(args, {queryFulfilled, dispatch}){
                try {
                    const { data } = await queryFulfilled

                    localStorage.setItem('refresh', data.token.refresh)
                    localStorage.setItem('access', data.token.access)

                    dispatch(Login(data))
                    dispatch(Users(data.strangers))
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        Mute: build.query({
            query: (params) => ({
                url: `/mute/${params.unique}`
            }),
            async onQueryStarted(args, {queryFulfilled, dispatch}){
                try {
                    const { data } = await queryFulfilled

                    localStorage.setItem('refresh', data.token.refresh)
                    localStorage.setItem('access', data.token.access)

                    dispatch(Login(data))
                    dispatch(select(data.selected))
                    console.log(data)
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        Status: build.query({
            query: (params) => ({
                url: `/status/${params.unique}`
            }),
            async onQueryStarted(args, {queryFulfilled, dispatch}){
                try {
                    const { data } = await queryFulfilled

                    localStorage.setItem('refresh', data.token.refresh)
                    localStorage.setItem('access', data.token.access)

                    dispatch(Login(data))
                    dispatch(select(data.selected))
                    console.log(data)
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        Online: build.mutation({
            query: (body) => ({
                url: '/online',
                method: 'POST',
                body: body
            }),
            async onQueryStarted(args, {queryFulfilled, dispatch}){
                try {
                    const { data } = await queryFulfilled

                    dispatch(Back(data))
                } catch (error) {
                    console.log(error)
                }
            }
        })
    })
})