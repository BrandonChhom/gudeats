// codeProjects/gudeats/frontend/src/components/CommentSection.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/client.js";

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/posts/${postId}/comments`)
      .then((data) => setComments(data.comments))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const data = await api.post(`/posts/${postId}/comments`, { content });
      setComments((prev) => [...prev, data.comment]);
      setContent("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="status">Loading comments...</p>;

  return (
    <div className="comments">
      {error && <p className="error-text">{error}</p>}

      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <strong>{comment.authorId?.username}</strong>
            {comment.content}
          </li>
        ))}
      </ul>

      {user ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment"
          />
          <button type="submit">Post</button>
        </form>
      ) : (
        <Link to="/login" className="login-prompt">Log in to comment</Link>
      )}
    </div>
  );
};

export default CommentSection;
