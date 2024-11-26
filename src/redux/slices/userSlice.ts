import { ActionReducerMapBuilder, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataStatus, userState } from "../../types/redux";
import { IUser, IWepone } from "../../types/user";

const initialState: userState = {
  error: null,
  status: DataStatus.IDLE,
  user: null,
};

export const fetchLogin = createAsyncThunk("user/login", async (user: { username: string; password: string }, thunkApi) => {
  try {
    const res = await fetch("http://localhost:2222/api/users/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (res.status != 200) {
      thunkApi.rejectWithValue("Can't login, please try again");
      return;
    }
    const data = await res.json();
    localStorage.setItem("Authorization", data.token);
    return data;
  } catch (err) {
    thunkApi.rejectWithValue("Can't login, please try again");
  }
});
export const fetchRegister = createAsyncThunk("user/register", async (user: { username: string; password: string; organization: string; area: string }, thunkApi) => {
  try {
    const res = await fetch("http://localhost:2222/api/users/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (res.status !== 200) {
      return thunkApi.rejectWithValue("Can't register, please try again");
    }

    const data = await res.json();

    localStorage.setItem("Authorization", data.token);

    const resWepones = await fetch("http://localhost:2222/api/attack/wepones", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
    });

    data.wepones = await resWepones.json();

    const resAttacks = await fetch(`http://localhost:2222/api/attack/${data.area}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
    });

    data.actions = await resAttacks.json();

    return data;
  } catch (err) {
    console.error("Error during registration:", err);
    return thunkApi.rejectWithValue("Can't register, please try again");
  }
});
export const fetchGetWepones = createAsyncThunk("user/attack", async (_, thunkApi) => {
  try {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      return thunkApi.rejectWithValue("No authorization token found");
    }
    const res = await fetch("http://localhost:2222/api/attack/wepones", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!res.ok) {
      return thunkApi.rejectWithValue("Failed to fetch weapons");
    }

    const weaponsData = await res.json();
    const weponeListForUser: IWepone[] = [];
    for (const weponeItem of weaponsData) {
      weponeListForUser.push({ wepone: (weponeItem as any).wepone, amount: (weponeItem as any).amount });
    }
    return weponeListForUser;
    const resAttacks = await fetch(`http://localhost:2222/api/attack/${weaponsData.area}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: weaponsData.token,
      },
    });

    if (!resAttacks.ok) {
      return thunkApi.rejectWithValue("Failed to fetch attacks");
    }

    const attacksData = await resAttacks.json();

    return attacksData; 
  } catch (err) {
    console.error("Error during weapons fetch:", err);
    return thunkApi.rejectWithValue("Failed to fetch weapons data");
  }
});
export const fetchGetActionsAtacker = createAsyncThunk(
  "user/attack/getAttacks", async (_, thunkApi) => {
  try {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      return thunkApi.rejectWithValue("No authorization token found");
    }
    const resAttacks = await fetch(`http://localhost:2222/api/attack/attacks`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!resAttacks.ok) {
      return thunkApi.rejectWithValue("Failed to fetch attacks");
    }

    const attacksData = await resAttacks.json();
    return attacksData;
  } catch (err) {
    console.error("Error during weapons fetch:", err);
    return thunkApi.rejectWithValue("Failed to fetch weapons data");
  }
});
export const fetchGetActionsDefencer = createAsyncThunk(
  "user/attack/getAttacks/Defencer", async (area:string, thunkApi) => {
  try {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      return thunkApi.rejectWithValue("No authorization token found");
    }
    const resAttacks = await fetch(`http://localhost:2222/api/attack/${area}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!resAttacks.ok) {
      return thunkApi.rejectWithValue("Failed to fetch attacks");
    }

    const attacksData = await resAttacks.json();
    return attacksData;
  } catch (err) {
    console.error("Error during weapons fetch:", err);
    return thunkApi.rejectWithValue("Failed to fetch weapons data");
  }
});
export const fetchLaunch = createAsyncThunk("user/attack/lunch", async (attack: { wepone: string; area: string }, thunkApi) => {
  try {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      return thunkApi.rejectWithValue("No authorization token found");
    }
    const res = await fetch("http://localhost:2222/api/attack", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, 
      },
      body: JSON.stringify(attack),
    });

    if (!res.ok) {
      return thunkApi.rejectWithValue("Failed to fetch weapons");
    }

    const launchData = await res.json();

    return launchData;
  } catch (err) {
    console.error("Error during weapons fetch:", err);
    return thunkApi.rejectWithValue("Failed to fetch weapons data");
  }
});
export const fetchIntersepted = createAsyncThunk("user/defence/lunch/ewre", async (attack: { wepone: string; attackID: string }, thunkApi) => {
  try {
    console.log("inters",attack);
    
    const token = localStorage.getItem("Authorization");
    if (!token) {
      return thunkApi.rejectWithValue("No authorization token found");
    }
    
    const res = await fetch("http://localhost:2222/api/attack/defence", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(attack),
    });

    if (!res.ok) {
      return thunkApi.rejectWithValue("Failed to fetch weapons");
    }

    const launchData = await res.json();

    return launchData;
  } catch (err) {
    console.error("Error during weapons fetch:", err);
    return thunkApi.rejectWithValue("Failed to fetch weapons data");
  }
});


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
      .addCase(fetchLogin.pending, (state) => {
        state.status = DataStatus.LOADING;
        state.error = null;
        state.user = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.error = null;
        state.user = action.payload as unknown as IUser as any;        
        (state.user as any).actions = [];
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error as string;
        state.user = null;
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.error = null;
        state.user = action.payload as unknown as IUser as any;
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error as string;
        state.user = null;
      })
      .addCase(fetchRegister.pending, (state) => {
        state.status = DataStatus.LOADING;
        state.error = null;
        state.user = null;
      })
      .addCase(fetchGetWepones.pending, (state) => {
        state.status = DataStatus.LOADING;
        state.error = null;
        if (state.user) {
          state.user.wepone = null;
        }
      })
      .addCase(fetchGetWepones.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.error = null;
        if (state.user) {
          const updatedUser = {
            ...state.user,
            wepone: action.payload as any,
          };
          state.user = updatedUser;
        }
      })
      .addCase(fetchGetWepones.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error as string;
        if (state.user) {
          state.user.wepone = null;
        }
      })
      .addCase(fetchLaunch.pending, (state) => {
        state.status = DataStatus.LOADING;
        state.error = null;
      })
      .addCase(fetchLaunch.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.error = null;
        if (state.user) {
          if (state.user.actions) {
            state.user.actions.push(action.payload);
            const weaponIndex = state.user.wepone?.findIndex((weapon) => weapon.wepone === action.payload.action);

            if (weaponIndex !== -1 && state.user.wepone) {
              state.user.wepone[weaponIndex!].amount -= 1;
            }
          }
        }
      })
      .addCase(fetchLaunch.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error as string;
      })
      .addCase(fetchGetActionsAtacker.pending, (state) => {
        state.status = DataStatus.LOADING;
        state.error = null;
      })
      .addCase(fetchGetActionsAtacker.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error as string;
      })
      .addCase(fetchGetActionsAtacker.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.error = null;
        if (state.user) {
          if (state.user.actions) {
            state.user.actions = action.payload;
          }
        }
      })
      .addCase(fetchGetActionsDefencer.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.error = null;
        if (state.user) {
          if (state.user.actions) {
            state.user.actions = action.payload;
          }
        }
      })
      .addCase(fetchGetActionsDefencer.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error as string;
      })
      .addCase(fetchGetActionsDefencer.pending, (state) => {
        state.status = DataStatus.LOADING;
        state.error = null;
      })
      .addCase(fetchIntersepted.pending, (state) => {
        state.status = DataStatus.LOADING;
        state.error = null;
      })
      .addCase(fetchIntersepted.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error as string;
      })
      .addCase(fetchIntersepted.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.error = null;
        if (state.user) {
          if (state.user.actions) {
            state.user.actions.push (action.payload);
          }
        }
      })
  },
});

export default userSlice;
