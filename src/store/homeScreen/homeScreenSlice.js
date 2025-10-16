import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/axios';
import { createSelector } from '@reduxjs/toolkit';

// Estado inicial para HomeScreen
const initialState = {
  items: [],
  hero: [],
  status: 'idle',
  error: null,
};

// Thunk para cargar datos de HomeScreen
export const fetchHomeScreen = createAsyncThunk(
  'homeScreen/fetchHomeScreen',
  async (_, { rejectWithValue }) => {
    console.log('[fetchHomeScreen] Starting fetch');
    try {
      const res = await api.get('/products/homescreen');
      console.log('res.data:', res.data);
      let data = res.data;
      // Manejar distintas formas de respuesta: array directo, { data: [...] }, { items: [...] }, { content: [...] }
      if (data && data.data && Array.isArray(data.data)) data = data.data;
      if (data && Array.isArray(data.items)) data = data.items;
      if (data && Array.isArray(data.content)) data = data.content;

      // Aquí ya no filtramos: guardamos los productos tal como vienen
      const items = Array.isArray(data) ? data : [];
      // Si el backend devuelve un arreglo `hero`, lo usamos; si no, derivamos de items los que tengan hero === true
      const hero = Array.isArray(res.data?.hero)
        ? res.data.hero.filter(p => p?.hero === true)
        : items.filter(p => p?.hero === true);

      return { items, hero };
    } catch (error) {
      return rejectWithValue(error.message || 'Error al cargar home');
    }
  }
);

const homeScreenSlice = createSlice({
  name: 'homeScreen',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeScreen.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHomeScreen.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.hero = action.payload.hero;
      })
      .addCase(fetchHomeScreen.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Error al cargar home';
      });
  },
});

// Selectores (robustos frente a state undefined)
const EMPTY_ARRAY = Object.freeze([]);
const selectHomeSlice = (state) => state?.homeScreen ?? initialState;
const selectProductsSlice = (state) => state?.products ?? { items: [] };

export const selectHomeProducts = createSelector(
  [selectHomeSlice],
  (home) => home.items ?? EMPTY_ARRAY
);

export const selectHomeHero = createSelector(
  [selectHomeSlice],
  (home) => {
    // Solo usar lo que trae el endpoint de home (home.hero) y filtrar por hero === true
    const hero = Array.isArray(home.hero) ? home.hero.filter(p => p?.hero === true) : EMPTY_ARRAY;
    return hero.length > 0 ? hero : EMPTY_ARRAY;
  }
);

export const selectHomeStatus = (state) => selectHomeSlice(state).status ?? 'idle';
export const selectHomeError = (state) => selectHomeSlice(state).error ?? null;

export default homeScreenSlice.reducer;
