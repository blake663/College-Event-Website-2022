const { useState } = require("react");


const EditComment = ({ email, rating, comment_body, comment_id, dispatcher }) => {
  const [ editedRating, setEditedRating ] = useState(rating);
  const [ editedComment, setEditedComment ] = useState(comment_body);
  
  return (
    <>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#id${comment_id}`}>
        Edit
      </button>

      <div className="modal" id={`id${comment_id}`}>
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h4 className="modal-title">Modal Heading</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => [setEditedComment(comment_body),setEditedRating(rating)]}></button>
            </div>

            <div className="modal-body">
            rating: 
            <input required type="number" value={editedRating} onChange={e => setEditedRating(e.target.value)} step="1" min="1" max="5"/>
              <input type="text" className="form-control" value={editedComment} onChange={e => setEditedComment(e.target.value)} />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-warning" data-bs-dismiss="modal" 
                onClick={() => dispatcher({}, 'edit', {comment_id, rating:editedRating, comment_body:editedComment})}>Save</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => [setEditedComment(comment_body),setEditedRating(rating)]}>Close</button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default EditComment;