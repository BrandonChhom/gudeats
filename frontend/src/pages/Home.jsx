// codeProjects/gudeats/frontend/src/pages/Home.jsx

import { useEffect, useState } from "react";
import PostCard from "../components/PostCard.jsx";
import api from "../api/client.js";

const formatWeekRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(new Date(end).getTime() - 1);
  const opts = { month: "short", day: "numeric", timeZone: "UTC" };
  return `${startDate.toLocaleDateString("en-US", opts)} – ${endDate.toLocaleDateString("en-US", opts)}`;
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [weekRange, setWeekRange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/feed")
      .then((data) => {
        setPosts(data.posts);
        setWeekRange(formatWeekRange(data.weekStart, data.weekEnd));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <header className="feed-head">
        <h1>This week's spread</h1>
        {weekRange && <p className="week-range">{weekRange}</p>}
      </header>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="empty-state">No posts yet this week.</p>
      )}

      <div className="feed">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onDeleted={() => setPosts((prev) => prev.filter((p) => p._id !== post._id))}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
