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
            <button onClick={() => dispatcher({}, 'delete', {comment_id:c.comment_id})}>Delete</button>
          </div>
            :
          ''
        }
      </div>
    )}
    <div>
      <form className="my-3" onSubmit={(e) => [dispatcher(e, 'add', {event_id, rating, comment_body:newComment}), setNewComment('')]}>
        <label>rating: 
          <input required type="number" value={rating} onChange={e => setRating(e.target.value)} step="1" min="1" max="5"/>
        </label><br/>
        <textarea required placeholder="comment on this event" 
          style={{display:"block", width:"100%", height:"80px"}}
          value={newComment} onChange={e => setNewComment(e.target.value)}
        />
        <button>Add</button>
      </form>
      <div class="card">
        <div class="row">
          <div class="col-2">
            <img src="https://i.imgur.com/xELPaag.jpg" width="70" class="rounded-circle mt-2" />
          </div>
          <div class="col-10">
            <div class="comment-box ml-2">
              <h4>Add a comment</h4>
              <div class="rating"> 
                <input type="radio" name="rating" value="5" id="5" /><label for="5">☆</label>
                <input type="radio" name="rating" value="4" id="4" /><label for="4">☆</label> 
                <input type="radio" name="rating" value="3" id="3" /><label for="3">☆</label>
                <input type="radio" name="rating" value="2" id="2" /><label for="2">☆</label>
                <input type="radio" name="rating" value="1" id="1" /><label for="1">☆</label>
              </div>
              <div class="comment-area">
                <textarea class="form-control" placeholder="what is your view?" rows="4"></textarea>
              </div>
              <div class="comment-btns mt-2">
                <div class="row">
                  <div class="col-6">
                  <div class="pull-left">
                    <button class="btn btn-success btn-sm">Cancel</button>      
                  </div>
                  </div>
                  <div class="col-6">
                    <div class="pull-right">
                      <button class="btn btn-success send btn-sm">Send <i class="fa fa-long-arrow-right ml-1"></i></button>      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);

};

export default CommentSection;