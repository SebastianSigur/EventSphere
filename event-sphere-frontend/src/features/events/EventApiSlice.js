import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"


const eventsAdapter = createEntityAdapter({})
const initialState = eventsAdapter.getInitialState()


export const eventsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getEvents: builder.query({
            query: () => ({
                url: '/events',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.error
                }
            }),
            transformResponse: responseData => {
                const loadedEvents = responseData.map(event => {
                    event.id = event._id
                    return event
                })
                return eventsAdapter.setAll(initialState, loadedEvents)
            },
            provideTages: (result, error, arg) => {
                if(result?.ids){ // if result is not undefined and has ids
                    return [
                        {type: 'Event', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'Event', id}))
                    ]
                } else return [{type: 'Event', id: 'LIST'}]
            }
        }),
        addNewEvent: builder.mutation({
            query: initialEventData => ({
                url: '/events',
                method: 'POST',
                body: {
                    ...initialEventData
                }
            }),
            invalidatesTags: [
                {type: 'Event', id: 'LIST'}
            ]
        }),
        updateEvent: builder.mutation({
            query: initialEventData => ({
                url: '/events',
                method: 'PATCH',
                body: {
                    ...initialEventData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Event', id: arg.id }
            ]
        }),
        deleteEvent: builder.mutation({
            query: ({ id }) => ({
                url: `/events`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Event', id: arg.id }
            ]
        }),
    })
})


export const {
    useGetEventsQuery,
    useAddNewEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
} = eventsApiSlice

export const selectEventsResult = eventsApiSlice.endpoints.getEvents.select()

const selectEventsData = createSelector(
    selectEventsResult,
    eventsResult => eventsResult.data 
)

export const {
    selectAll: selectAllEvents,
    selectById: selectEventById,
    selectIds: selectEventIds
} = eventsAdapter.getSelectors(state => selectEventsData(state) ?? initialState)
