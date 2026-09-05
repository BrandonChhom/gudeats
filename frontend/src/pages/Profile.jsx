// codeProjects/gudeats/frontend/src/pages/Profile.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/client.js";
import PostCard from "../components/PostCard.jsx";

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");
    setProfile(null);

    Promise.all([api.get(`/users/${username}`), api.get(`/users/${username}/posts`)])
      .then(([profileData, postsData]) => {
        setProfile(profileData.user);
        setPosts(postsData.posts);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    setFollowing(null);
    if (!user || user.username === username) return;

    api
      .get(`/users/${username}/follow`)
      .then((data) => setFollowing(data.following))
      .catch(() => {});
  }, [user, username]);

  const toggleFollow = async () => {
    const data = following
      ? await api.del(`/users/${username}/follow`)
      : await api.post(`/users/${username}/follow`);
    setFollowing(data.following);
  };

  if (loading) return <p className="status">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div>
      <div className="profile-head">
        <h1>{profile.username}</h1>

        {user && user.username !== username && following !== null && (
          <button
            type="button"
            className={`follow-btn${following ? " following" : ""}`}
            onClick={toggleFollow}
          >
            {following ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {posts.length === 0 ? (
        <p className="empty-state">No posts yet.</p>
      ) : (
        <div className="feed">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              showAuthor={false}
              onDeleted={() => setPosts((prev) => prev.filter((p) => p._id !== post._id))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
