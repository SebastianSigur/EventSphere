import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



export const apiSlice = createApi({
    baseQuery: "http://localhost:3500",
    tagTypes: ['Event', 'Commment', 'User'],
    endpoints: builder => ({})
})
