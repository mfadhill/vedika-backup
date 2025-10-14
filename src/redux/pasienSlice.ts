import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export type Pasien = {
   no_rawat: string;
   no_rkm_medis: string;
   tgl_registrasi: string;
   status: string;
   no_sep: string;
   no_kartu: string;
   nm_pasien: string;
   tgl_lahir: string;
   jk: string;
};

type PasienState = {
   pasienList: Pasien[];
   loading: boolean;
   error: string | null;
};

const initialState: PasienState = {
   pasienList: [],
   loading: false,
   error: null,
};

export const fetchPasien = createAsyncThunk(
   "pasien/fetchPasien",
   async () => {
      const res = await axios.get("http://192.168.20.4:3000/grab/list");
      return res.data.data || [];
   }
);

const pasienSlice = createSlice({
   name: "pasien",
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchPasien.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchPasien.fulfilled, (state, action) => {
            state.loading = false;
            state.pasienList = action.payload;
         })
         .addCase(fetchPasien.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Gagal fetch data pasien";
         });
   },
});

export default pasienSlice.reducer;
