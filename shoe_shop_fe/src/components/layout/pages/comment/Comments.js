import React,{ useState, useEffect } from "react";
import "./comment.css";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import {
  getComments as getCommentsApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from "./commentsAPI";
import PropTypes from "prop-types";

function Comments({ user, productId }) {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId === null
  );


  // console.log(backendComments);
  // console.log(rootComments);
  const getReplies = (commentId) => {
    const replies = backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      //console.log(replies);
    return replies;
  };
  const addComment = (userId, username, productId, text, parentId) => {
    if(user){
    //console.log(userId, username, productId, text, parentId);
    createCommentApi(userId, username, productId, text, parentId).then((comment) => {
      setBackendComments([comment, ...backendComments]);
      setActiveComment(null);
    });
  }else{
    alert("Bạn cần đăng nhập để bình luận");
  }};

  const updateComment = (commentId, text ) => {
    updateCommentApi(commentId, text).then(() => {
      const updatedBackendComments = backendComments.map((backendComment) => {
        if (backendComment._id === commentId) {
          return { ...backendComment, body: text };
        }
        return backendComment;
      });
      setBackendComments(updatedBackendComments);
      setActiveComment(null);
    });
  };
  const deleteComment = (commentId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận?")) {
      deleteCommentApi(commentId).then(() => {
        const updatedBackendComments = backendComments.filter(
          (backendComment) => backendComment._id !== commentId
        );
        setBackendComments(updatedBackendComments);
      });
    }
  };

  useEffect(() => {
    getCommentsApi(productId).then((data) => {
      setBackendComments(data);
    });
  }, [productId]);

  return (
    <div className="comments">
      <h3 className="comments-title">Bình luận</h3>
      {user ? (
        <CommentForm submitLabel="Add" handleSubmit={addComment} userId={user._id} username={user.username} productId={productId} />):(
        <CommentForm submitLabel="Add" handleSubmit={addComment}/>)}
      {/* <CommentForm submitLabel="Add" handleSubmit={addComment} userId={user._id} username={user.username} productId={productId} /> */}
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <Comment
            key={rootComment._id}
            comment={rootComment}
            replies={getReplies(rootComment._id)}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            deleteComment={deleteComment}
            updateComment={updateComment}
            currentUserId={rootComment.userId}
          />
        ))}
      </div>
    </div>
  );
}

Comments.propTypes = {
  user: PropTypes.object.isRequired,
  productId: PropTypes.string.isRequired,
};

export default Comments