import getFullPlaceInfoByIdUrl from '@constants/getFullPlaceInfoByIdUrl';
import { Action, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import PlaceInfo from '@type/placeInfo';
import axios, { AxiosError } from 'axios';

interface FavoritesSliceState {
  currentPlace: PlaceInfo | null;
  list: PlaceInfo[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesSliceState = {
  currentPlace: null,
  list: [],
  loading: false,
  error: null,
};

export const fetchPlaceInfoById = createAsyncThunk<PlaceInfo, string, { rejectValue: string }>(
  'favorites/fetchPlaceInfoById',
  async function (xid: string, { rejectWithValue }) {
    const data = await axios
      .get<PlaceInfo>(getFullPlaceInfoByIdUrl(xid))
      .then((res) => res.data)
      .catch((e: AxiosError) => {
        return rejectWithValue(e.message);
      });

    return data;
  },
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavouritePlace(state, action: PayloadAction<PlaceInfo>) {
      state.list.push(action.payload);
    },
    removeFavoritePlace(state, action: PayloadAction<string>) {
      state.list = state.list.filter((place) => place.xid !== action.payload);
    },
    setCurrentPlace(state, action: PayloadAction<string>) {
      const oldPlace = state.list.find((place) => place.xid === action.payload);

      if (oldPlace) {
        state.currentPlace = oldPlace;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaceInfoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaceInfoById.fulfilled, (state, action) => {
        state.currentPlace = action.payload;
        state.loading = false;
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default favoritesSlice.reducer;
export const { addFavouritePlace, removeFavoritePlace, setCurrentPlace } = favoritesSlice.actions;

function isError(action: Action) {
  return action.type.endsWith('rejected');
}
