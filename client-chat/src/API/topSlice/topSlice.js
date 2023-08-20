import { createSlice } from "@reduxjs/toolkit";

const topSlice = createSlice({
    name: 'topSlice',
    initialState: {
        chatId: '',
        messages: [],
        selected: {}
    },
    reducers: {
        getChat(state, action){
            state.chatId = action.payload.chatId,
            state.messages = action.payload.messages
        },
        leaveChat(state, action){
            state.chatId = ''
            state.messages = []
        },
        select(state, action){
            state.selected = action.payload
            localStorage.setItem('lastUser', action.payload.userUnique)
        },
        clearSelect(state, action){
            state.selected = {}
            localStorage.removeItem('lastUser')
        }
    }
})
export const { getChat, leaveChat, select, clearSelect } = topSlice.actions
export default topSlice.reducer
