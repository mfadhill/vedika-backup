import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export type Ranap = {
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

type RanapState = {
   pasienList: Ranap[];
   loading: boolean;
   error: string | null;
};

const initialState: RanapState = {
   pasienList: [],
   loading: false,
   error: null,
};

export const fetchRanap = createAsyncThunk(
   "ranap/fetchRanap",
   async () => {
      const res = await axios.get("http://192.168.20.4:3000/grab/ranap/list");
      console.log("Data dari API:", res.data.data);
      return res.data.data || [];
   }
);

const ranapSlice = createSlice({
   name: "ranap",
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchRanap.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchRanap.fulfilled, (state, action) => {
            state.loading = false;
            state.pasienList = action.payload;
         })
         .addCase(fetchRanap.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Gagal fetch data ranap";
         });
   },
});

export default ranapSlice.reducer;
