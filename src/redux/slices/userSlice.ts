import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { DataStatus, userState } from "../../types/redux";
import { IUser } from "../../types/user";

const initialState: userState = {
  error: null,
  status: DataStatus.IDLE,
  user: null,
};

export const fetchLogin = createAsyncThunk(
  "user/login",
  async (user: { username: string; password: string }, thunkApi) => {
    try {
      const res = await fetch("http://localhost:2222/api/users/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      console.log(res);
      
      if (res.status != 200) {        
        thunkApi.rejectWithValue("Can't login, please try again");
        return
      }
      const data = await res.json();
      // thunkApi.fulfillWithValue(data);
      localStorage.setItem("Authorization", data.token);
      return data;
    } catch (err) {
      thunkApi.rejectWithValue("Can't login, please try again");
    }
  }
);

export const fetchProfileUpdate = createAsyncThunk(
  "user/profile",
  async (id: string, thunkApi) => {
    try {
      const res = await fetch("http://localhost:2222/api/users/profile", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage["Authorization"]!,
        },
        body: JSON.stringify({ id }),
      });
      if (res.status != 200) {
        thunkApi.rejectWithValue("Can't update profile, please try again");
      }
      const data = await res.json();
      return data;
    } catch (err) {
      thunkApi.rejectWithValue("Can't login, please try again");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<userState>) => {
    builder
      .addCase(fetchLogin.pending, (state, action) => {
        state.status = DataStatus.LOADING;
        state.error = null;
        state.user = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.error = null;
        state.user = action.payload as unknown as IUser as any;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error as string;
        state.user = null;
      }).addCase(fetchProfileUpdate.fulfilled, (state, action) => {
        state.user = {...state.user, ...action.payload};
      });
  },
});

export default userSlice;
