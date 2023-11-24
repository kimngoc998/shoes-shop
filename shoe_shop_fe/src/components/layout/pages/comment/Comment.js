import CommentForm from "./CommentForm";
import "./comment.css";
import userIcon from "../../img/user-icon.png";
import { faKey} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import {checkHasOrder} from './commentsAPI'
import React, {useState} from "react";
import PropTypes from "prop-types";
const Comment = ({
  comment,
  replies,
  setActiveComment,
  activeComment,
  updateComment,
  deleteComment,
  addComment,
  parentId,
  currentUserId,
}) => {
  const [apiResult, setApiResult] = useState(false);
  checkHasOrder(comment.userId, comment.productId)
  .then((result) => {
    setApiResult(result) ;
  })


  // const getReplies = (commentId) => {
  //   const list = replies
  //     .filter((replie) => replie.parentId === commentId)
  //     .sort(
  //       (a, b) =>
  //         new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  //     );
  //     console.log(list);
  
  //   return list;
  // };

  const isEditing =
    activeComment &&
    activeComment.id === comment._id &&
    activeComment.type === "editing";
  const isReplying =
    activeComment &&
    activeComment.id === comment._id &&
    activeComment.type === "replying";
  
  const timePassedfiveMinutes = new Date() - new Date(comment.createdAt) > 300000;
  // const timePassedOneDay = (new Date() - new Date(comment.createdAt)) > (1 * 24 * 60 * 60 * 1000);
  // const timePassedTwoDays = (new Date() - new Date(comment.createdAt)) > (2 * 24 * 60 * 60 * 1000);
  // const timePassedThreeDays = (new Date() - new Date(comment.createdAt)) > (3 * 24 * 60 * 60 * 1000);

  const canDelete =
    currentUserId === comment.userId && replies?.length === 0 && !timePassedfiveMinutes;
  const canReply = Boolean(currentUserId);
  const canEdit = currentUserId === comment.userId;
  const replyId = parentId ? parentId : comment._id;
  const createdAt = new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) +(" ")+ new Date(comment.createdAt).toLocaleDateString();


  return (
    <div key={comment._id} className="comment">
      <div className="comment-right-part">
        <div className="comment-content">
        <div className="comment-image-container">
        <img src={userIcon} />
      </div>
      
          <div className="comment-author">{comment.username} {comment.userId === '648a98e7a1cad6e07158c5df' && <FontAwesomeIcon icon={faKey} className="iconblue" />}  {apiResult && <><FontAwesomeIcon icon={faCheckCircle} className="icongreen"/><p>Đã mua</p></>}</div>
          <div className="comment-time">{createdAt}</div>
        </div>
        {!isEditing && <div className="comment-text">{comment.body}</div>}
        {isEditing && (
          <CommentForm
            submitLabel="Update"
            hasCancelButton
            initialText={comment.body}
            commentId={comment._id}
            handleSubmit={(text) => updateComment(comment._id, text)}
            handleCancel={() => {
              setActiveComment(null);
            }}
          />
        )}
        <div className="comment-actions">
          {canReply && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: comment._id, type: "replying" })
              }
            >
              Reply
            </div>
          )}
          {canEdit && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: comment._id, type: "editing" })
              }
            >
              Edit
            </div>
          )}
          {canDelete && (
            <div
              className="comment-action"
              onClick={() => deleteComment(comment._id)}
            >
              Delete
            </div>
          )}
        </div>
        {isReplying && (
          <CommentForm
            submitLabel="Reply"
            parentId={replyId}
            handleSubmit={addComment}
            productId = {comment.productId}
            userId = {comment.userId}
            username = {comment.username}
            hasCancelButton
            handleCancel={() => {
              setActiveComment(null);
            }}
          />
        )}
        {replies?.length > 0 && (
          <div className="replies">
            {replies.map((reply) => (
              <Comment
                comment={reply}
                key={reply._id}
                setActiveComment={setActiveComment}
                activeComment={activeComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
                addComment={addComment}
                parentId={comment._id} //parentId={reply._id}    //chưa làm đc hiển thị comment lv3               Đmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                replies={[]} //replies={getReplies(reply._id)}   
                currentUserId={reply.userId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  replies: PropTypes.array.isRequired,
  setActiveComment: PropTypes.func.isRequired,
  activeComment: PropTypes.string,
  updateComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  parentId: PropTypes.string,
  currentUserId: PropTypes.string.isRequired,
};
  


export default Comment;