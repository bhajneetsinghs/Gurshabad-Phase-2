import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",

  initialState: {
    results: [],
    query: "",
  },

  reducers: {

    setQuery: (state, action) => {
      state.query = action.payload;
    },

    setResults: (state, action) => {
      state.results = action.payload;
    },

  },
});

export const { setQuery, setResults } = searchSlice.actions;

export default searchSlice.reducer;