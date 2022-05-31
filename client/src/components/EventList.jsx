import { useEffect, useState } from "react";
import CommentSection from "./CommentSection";



const EventList = ({ email }) => {

  const [ events, setEvents ] = useState([]);
  const [ comments, setComments ] = useState([]);
  const [ memberships, setMemberships ] = useState(new Set());


  const getEventsAndComments = async () => {
    console.log('trying to get events');
    const response = await fetch('http://localhost:5000/events');
    const events = await response.json();
    events.sort((a, b) => a.event_id - b.event_id)
    setEvents(events);

    const response2 = await fetch('http://localhost:5000/comments');
    const comments = await response2.json();
    comments.sort((a, b) => a.comment_id - b.comment_id)
    setComments(comments);
    console.log(comments);
  }

  async function getMemberships() {
    const response = await fetch(`http://localhost:5000/rso_member/${email}`);
    setMemberships(new Set((await response.json()).filter(rso => rso.isMember).map(rso => rso.RSO_ID)));
    console.log(memberships);
  }
  
  useEffect(() => {
    getEventsAndComments();
    getMemberships();
    console.log(memberships);
  },[])

  async function dispatcher(e, operation, data) {
    switch (operation) {
      case 'add':
        e.preventDefault();
        var body = {...data, email};
        var response = await fetch("http://localhost:5000/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const comment = await response.json();
        console.log(comment)
        setComments([...comments, comment]);
        console.log('made it all the way here')
        break;
      case 'edit':
        var body = data;
        var response = await fetch(`http://localhost:5000/comments/${data.comment_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        await response.json();
        setComments(comments.map(com => 
          com.comment_id == data.comment_id ?
          {...com, rating:data.rating, comment_body: data.comment_body} :
          com
        ));
        break;
      case 'delete':
        console.log('data before delete:', data)
        await fetch(`http://localhost:5000/comments/${data.comment_id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        console.log('api returned');
        setComments(comments.filter(com => com.comment_id != data.comment_id));
    }
  }

  function filterEvents(event) {
    switch (event.visibility_level) {
      case 3: return true;
      case 2: return event.school_domain == email.split('@')[1];
      case 1: return memberships.has(event.RSO_ID);
    }
  }

  return (
    <>
      <h3>Events: </h3>
      <div className="accordion">
        {
          events.filter(filterEvents).map(event =>
            <div className="accordion-item" key={event.event_id}>
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${event.event_id}`}>
                  <strong style={{width:"200px"}}>{event.event_name}</strong>
                  <span style={{marginLeft:"auto"}}>{event.datetime.substr(0, event.datetime.length-8)}</span>
                </button>
              </h2>
              <div id={`collapse${event.event_id}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <strong>RSO:</strong>{event.rso_name}<br/>
                  <strong>Description:</strong>{event.description}<br/>
                  <CommentSection email={email} event_id={event.event_id} comments={comments} dispatcher={dispatcher} />
                </div>
              </div>
            </div>
          )
        }
      </div>
    </>
  );
};

export default EventList;