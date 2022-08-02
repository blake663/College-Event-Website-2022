import EditComment from './EditComment';
const { useState } = require("react");

const CommentSection = ({ email, event_id, comments, dispatcher }) => {
  const [ newComment, setNewComment ] = useState('');
  const [ rating, setRating ] = useState(5);


  return (<>
    {comments.filter(c => c.event_id == event_id).map((c, index)=>
      <div key={c.comment_id} style={{border:"solid black 1px"}}>
        <h5>{c.email==email?"You":c.email}</h5>
        <p>
          rating: {c.rating}
        </p>
        <p>{c.comment_body}</p>
        {
          c.email==email
            ?
          <div>
            <EditComment rating={c.rating} comment_body={c.comment_body} comment_id={c.comment_id} dispatcher={dispatcher} />
            <button onClick={() => dispatcher({}, 'delete', {comment_id:c.comment_id})} className='btn btn-warning'>Delete</button>
          </div>
            :
          ''
        }
      </div>
    )}
    <div>
      <form className="my-3" onSubmit={(e) => [dispatcher(e, 'add', {event_id, rating, comment_body:newComment}), setNewComment('')]}>
        <label className='d=inline'>rating: 
          <input required type="number" value={rating} onChange={e => setRating(e.target.value)} step="1" min="1" max="5" className="form-control d-inline"/>
        </label><br/>
        <textarea required placeholder="comment on this event" 
          className="form-control mt-2"
          style={{display:"block", width:"100%", height:"80px"}}
          value={newComment} onChange={e => setNewComment(e.target.value)}
        />
        <button className="btn btn-success ml-0 d-block ms-auto mt-2">Add</button>
      </form>
    </div>
  </>);

};

export default CommentSection;