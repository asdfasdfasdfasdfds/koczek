import { User } from "@/models/user";
import { createSlice } from "@reduxjs/toolkit";
import { redirect } from "next/navigation";


interface AccountState {
    user: User | null;
}
const initialState: AccountState = {
    user: null
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem("user");
            redirect('/')
        },
        setUser: (state, action) => {
            if (action.payload && action.payload.token) {
                let claims = JSON.parse(atob(action.payload.token.split('.')[1]))
                let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                state.user = { ...action.payload, roles: typeof (roles) === "string" ? [roles] : roles }
                localStorage.setItem('user', JSON.stringify(action.payload));
            } else {
              signOut();
            }

        },
      
    }
})

export const { signOut, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
