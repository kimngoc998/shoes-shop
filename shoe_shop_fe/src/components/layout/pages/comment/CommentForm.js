import React, { useState } from "react";
import "./comment.css";
import PropTypes from "prop-types";

const CommentForm = ({
  handleSubmit,
  submitLabel,
  hasCancelButton = false,
  handleCancel,
  initialText = "",
  userId,
  username,
  productId,
  parentId,
   // eslint-disable-next-line
  commentId
}) => {
  const [text, setText] = useState(initialText);
  const isTextareaDisabled = text.length === 0;
  const onSubmit = (event) => {
    event.preventDefault();
    console.log(submitLabel);
    if(submitLabel === "Reply"){
      handleSubmit(userId, username, productId, text, parentId)
    }else if(submitLabel === "Add"){
      handleSubmit(userId, username, productId, text);
    }else{
      handleSubmit(text);
    }
    
    setText("");
  };



  return (
    <form onSubmit={onSubmit}>
      <textarea
        className="comment-form-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your comment"
      />
      <div className="button-container">
      <button className="comment-form-button" disabled={isTextareaDisabled}>
        {submitLabel}
      </button>
      {hasCancelButton && (
        <button
          type="button"
          className="comment-form-button comment-form-cancel-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      )}
      </div>
    </form>
  );
};

CommentForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
  hasCancelButton: PropTypes.bool,
  handleCancel: PropTypes.func,
  initialText: PropTypes.string,
  userId: PropTypes.string,
  username: PropTypes.string,
  productId: PropTypes.string,
  parentId: PropTypes.string,
  commentId: PropTypes.string
};

export default CommentForm;