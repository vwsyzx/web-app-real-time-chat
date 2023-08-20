import {createSlice} from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'userSlice',
    initialState: {
        user: {},
        friends: [],
        strangers: [],
        auth: false,
        status: false
    },
    reducers: {
        Login(state, action){
            state.user = action.payload.userPret
            state.friends = action.payload.friends
            state.auth = true
        },
        StatusOn(state, action){
            state.status = true
        },
        StatusOff(state, action){
            state.status = false
        },
        Back(state, action){
            if(state.status){
                state.friends = action.payload.otherFriends
            }
            else if(!state.status){
                state.friends = action.payload.friends
            } 
        },
        Logout(state, action){
            state.user = {}
            state.friends = []
            state.strangers = []
            state.auth = false
        },
        Users(state, action){
            state.strangers = action.payload
        }
    }
})

export const {Login, Logout, Users, Back, StatusOn, StatusOff} = userSlice.actions
export default userSlice.reducer