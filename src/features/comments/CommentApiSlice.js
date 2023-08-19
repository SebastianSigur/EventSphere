import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const comemntsAdapter = createEntityAdapter({})
const initialState = comemntsAdapter.getInitialState()

export const commentApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getComments: builder.query({
            query: ()=>({
                url: '/comments',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedComments = responseData.map(comment => {
                    comment.id = comment._id
                    return comment
                });
                return comemntsAdapter.setAll(initialState, loadedComments)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Comment', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Comment', id }))
                    ]
                } else return [{ type: 'Comment', id: 'LIST' }]
            }
        }),
        addNewComment: builder.mutation({
            query: initialCommentData => ({
                url: '/comments',
                method: 'POST',
                body: {
                    ...initialCommentData
                }
            }),
            invalidatesTags: [
                { type: 'Comment', id: 'LIST' }
            ]
        }),
        deleteComment: builder.mutation({
            query: commentId => ({
                url: `/comments/${commentId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Comment', id: arg }]
        }),
        updateComment: builder.mutation({
            query: updatedCommentData => ({
                url: `/comments/${updatedCommentData.id}`,
                method: 'PUT',
                body: {
                    ...updatedCommentData
                }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Comment', id: arg }]
        }),
    }),
})

export const {
    useGetCommentsQuery,
    useAddNewCommentMutation,
    useDeleteCommentMutation,
    useUpdateCommentMutation
} = commentApiSlice

export const selectCommentsResults = commentApiSlice.endpoints.getComments.select()

const selectCommentsData = createSelector(
    selectCommentsResults,
    comments => comments.data
)

export const {
    selectAll: selectAllComments,
    selectById: selectCommentById,
    selectIds: selectCommentIds
} = comemntsAdapter.getSelectors(state => selectCommentsData(state) ?? initialState)
