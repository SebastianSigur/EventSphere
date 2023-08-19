import { useGetEventsQuery } from "./EventApiSlice";
import EventMini from "./eventMini";
import PulseLoader from 'react-spinners/PulseLoader'
import { useSelector } from 'react-redux';
import { useGetUsersQuery } from "../users/UserApiSlice";
import useAuth from "../../hooks/useAuth";
const EventsList = (props) => {

    const {userId, isPublic, showAll} = props
    const { id, status } = useAuth()
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        })
    })
    
    const filter = useSelector(state => state.filter);
    const {
        data: events,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetEventsQuery('eventsList', {
        pollingInterval: 60*1000 ,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })

    let content

    if (isLoading) content = <PulseLoader color={'#FFF'} />
    if (isError) content = <p className="errmsg">{error?.data?.message}</p>

    if(isSuccess) {
        
        


        let { ids } = events
        if(ids){
            if(userId){
                ids = ids.filter(event => events.entities[event].owner === userId)
            }
            if(isPublic){
                ids = ids.filter(event => events.entities[event].public)
            }   

        }
        switch(filter){
            case 'all':
                break;
            case 'top':
                ids = ids.slice().sort((a, b) => events.entities[b].likes - events.entities[a].likes);
                break;
            case 'old':
                ids = ids.slice().sort((a, b) => new Date(events.entities[a].createdAt)- new Date(events.entities[b].createdAt))
                break;
            case 'new':
                ids = ids.slice().sort((a, b) => new Date(events.entities[b].createdAt)- new Date(events.entities[a].createdAt))
                break
            case 'friends':
                ids = status!=='guest' ? ids.filter(event =>user?.friends && user?.friends.includes(events.entities[event].owner)) : [] 
                break;
            default:
                break;
        }

        if(!isPublic ) ids = ids.filter(event => events.entities[event].invited.includes(id) || events.entities[event].owner === id)
        let events_list = ids.map(eventId => <EventMini event={events?.entities[eventId]}/>)
        if(events_list.length === 0) events_list = <img src="https://i.imgur.com/foHQanb.png" alt="no events" className="no-events"/>
        content = (
            <div className="event-list">
                
                {events_list}
            </div>
        )

    }
    return content;

}

export default EventsList