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
    try {
      const resWepones = await fetch("http://localhost:2222/api/attack/wepones", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${data.token}`,
        },
      });
      // console.log("ghjghjgh",await resWepones.json());
      // data.wepones = await resWepones.json()
    } catch (error) {
      console.log(error);
    }
    console.log("data", data);
    return data;
  } catch (err) {
    thunkApi.rejectWithValue("Can't login, please try again");
  }
});
export const fetchRegister = createAsyncThunk("user/register", async (user: { username: string; password: string; organization: string; area: string }, thunkApi) => {
  try {
    // שליחת בקשת הרישום
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
    console.log("Registration data", data);

    // שמירת ה-token ב-localStorage לאחר הרישום
    localStorage.setItem("Authorization", data.token);

    // בקשת הנתונים של הנשקים
    const resWepones = await fetch("http://localhost:2222/api/attack/wepones", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
    });

    // עדכון הנתונים של הנשקים במידע שמחזירים
    data.wepones = await resWepones.json();

    // בקשת הנתונים של פעולות האזור של המשתמש
    const resAttacks = await fetch(`http://localhost:2222/api/attack/${data.area}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
    });

    // עדכון הנתונים של הפעולות במידע שמחזירים
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
        Authorization: token, // אין צורך ב-template literal כאן
      },
    });

    if (!res.ok) {
      // בדיקה טובה יותר מאשר בדיקת status
      return thunkApi.rejectWithValue("Failed to fetch weapons");
    }

    const weaponsData = await res.json();
    const weponeListForUser: IWepone[] = [];
    for (const weponeItem of weaponsData) {
      weponeListForUser.push({ wepone: (weponeItem as any).wepone, amount: (weponeItem as any).amount });
    }
    console.log(weponeListForUser);
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

    return attacksData; // או מה שאתה רוצה להחזיר
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
    console.log(attacksData);
    
    const attacksDataForUser = []
    for (const element of attacksData) {
      
    }
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
        Authorization: token, // אין צורך ב-template literal כאן
      },
      body: JSON.stringify(attack),
    });

    if (!res.ok) {
      return thunkApi.rejectWithValue("Failed to fetch weapons");
    }

    const launchData = await res.json();

    console.log(launchData);
    return launchData;
    // return launchData
  } catch (err) {
    console.error("Error during weapons fetch:", err);
    return thunkApi.rejectWithValue("Failed to fetch weapons data");
  }
});

// export const fetchProfileUpdate = createAsyncThunk(
//   "user/profile",
//   async (id: string, thunkApi) => {
//     try {
//       const res = await fetch("http://localhost:2222/api/users/profile", {
//         method: "post",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: localStorage["Authorization"]!,
//         },
//         body: JSON.stringify({ id }),
//       });
//       if (res.status != 200) {
//         thunkApi.rejectWithValue("Can't update profile, please try again");
//       }
//       const data = await res.json();
//       return data;
//     } catch (err) {
//       thunkApi.rejectWithValue("Can't login, please try again");
//     }
//   }
// );

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
      .addCase(fetchRegister.pending, (state, action) => {
        state.status = DataStatus.LOADING;
        state.error = null;
        state.user = null;
      })
      .addCase(fetchGetWepones.pending, (state, action) => {
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
          state.user = updatedUser; // כאן נעדכן את state.user מחדש
        }
      })
      .addCase(fetchGetWepones.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error as string;
        if (state.user) {
          state.user.wepone = null;
        }
      })
      .addCase(fetchLaunch.pending, (state, action) => {
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
      .addCase(fetchGetActionsAtacker.pending, (state, action) => {
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
      });

    // .addCase(fetchProfileUpdate.fulfilled, (state, action) => {
    //   state.user = {...state.user, ...action.payload};
    // });
  },
});

export default userSlice;
