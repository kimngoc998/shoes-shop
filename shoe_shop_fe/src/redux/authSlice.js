import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        login:{
            currentUser:null,
            isFetching:false,
            error:false,
        },
        logout:{
            isFetching:false,
            error:false
        },
        register:{
            isFetching:false,
            error:false,
            success:false
        }
    },
    reducers:{
        loginStart:(state) =>{
            state.login.isFetching = true;
        },
        loginSuccess:(state, action) =>{
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        // eslint-disable-next-line
        loginFailed:(state, action) =>{
            state.login.isFetching = false;
            state.login.error = true;
        },
        // eslint-disable-next-line
        logOutSuccess:(state, action) =>{
            state.logout.isFetching = false;
            state.logout.currentUser = null;
            state.logout.error = false;
        },
        logOutFailed:(state) =>{
        state.logout.isFetching = false;
        state.logout.error = true;
        },
        logOutStart:(state, action) =>{
            state.logout.isFetching = true;
            state.login.currentUser = action.payload;
        },
        registerStart:(state) =>{
            state.register.isFetching = true;
        },
        registerSuccess:(state) =>{
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerFailed:(state) =>{
        state.register.isFetching = false;
        state.register.error = true;
        state.register.success = false;
        },
    }
});

export const {
    loginStart,
    loginFailed,
    loginSuccess,
    logOutFailed,
    logOutStart,
    logOutSuccess,
    registerStart,
    registerSuccess,
    registerFailed
} = authSlice.actions;

export default authSlice.reducer;