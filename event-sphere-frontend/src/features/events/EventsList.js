const EventList = () => {



    
    const events_list = dummyEvents.map(eventItem => <EventMini event={eventItem}/>);
    content = (
        <div className="event-list">
                        {events_list}
        </div>

    )
}