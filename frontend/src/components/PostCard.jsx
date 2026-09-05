// codeProjects/gudeats/frontend/src/components/PostCard.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/client.js";
import CommentSection from "./CommentSection.jsx";

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
    <path d="M12 20.25c-.3 0-.6-.1-.8-.3C7 16.5 3.5 13.4 3.5 9.9 3.5 7.4 5.4 5.5 7.8 5.5c1.4 0 2.7.7 3.5 1.8.8-1.1 2.1-1.8 3.5-1.8 2.4 0 4.3 1.9 4.3 4.4 0 3.5-3.5 6.6-7.7 10.05-.2.2-.5.3-.8.3z" />
  </svg>
);

const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
    <path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-4.5 4v-4H4A1.5 1.5 0 0 1 2.5 16V7A1.5 1.5 0 0 1 4 5.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
    <path d="M4 7h16" />
    <path d="M9 7V4.8A.8.8 0 0 1 9.8 4h4.4a.8.8 0 0 1 .8.8V7" />
    <path d="M6.5 7l.9 12.1a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4L18.5 7" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const PostCard = ({ post, showAuthor = true, onDeleted }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const isOwner = Boolean(user && post.authorId?._id === user.id);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    api
      .get(`/posts/${post._id}/likes`)
      .then((data) => {
        if (!cancelled) {
          setLiked(data.liked);
          setLikeCount(data.likeCount);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [user, post._id]);

  const toggleLike = async () => {
    const data = liked
      ? await api.del(`/posts/${post._id}/likes`)
      : await api.post(`/posts/${post._id}/likes`);
    setLiked(data.liked);
    setLikeCount(data.likeCount);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    await api.del(`/posts/${post._id}`);
    onDeleted?.();
  };

  return (
    <article className="card">
      {showAuthor && post.authorId?.username && (
        <div className="card-author">
          <span className="avatar">{post.authorId.username[0].toUpperCase()}</span>
          <Link to={`/users/${post.authorId.username}`} className="username-link">
            {post.authorId.username}
          </Link>
        </div>
      )}

      <div className="card-image">
        <img src={post.imageUrl} alt={post.caption || "Food post"} />
      </div>

      <div className="card-body">
        {post.caption && <p className="caption">{post.caption}</p>}
        {post.recipe && (
          <p className="meta">
            <span className="label">Recipe</span>
            {post.recipe}
          </p>
        )}
        {post.location && (
          <p className="meta">
            <span className="label">Location</span>
            {post.location}
          </p>
        )}
      </div>

      <div className="card-actions">
        {user ? (
          <button type="button" className={`action-btn${liked ? " liked" : ""}`} onClick={toggleLike}>
            <HeartIcon />
            {liked ? "Unlike" : "Like"} {likeCount !== null ? likeCount : ""}
          </button>
        ) : (
          <Link to="/login" className="login-prompt">Log in to like</Link>
        )}

        <button type="button" className="action-btn" onClick={() => setShowComments((prev) => !prev)}>
          <CommentIcon />
          {showComments ? "Hide comments" : "Comments"}
        </button>

        {isOwner && (
          <button type="button" className="action-btn delete" onClick={handleDelete}>
            <TrashIcon />
            Delete
          </button>
        )}
      </div>

      {showComments && <CommentSection postId={post._id} />}
    </article>
  );
};

export default PostCard;
