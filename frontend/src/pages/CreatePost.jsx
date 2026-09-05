// codeProjects/gudeats/frontend/src/pages/CreatePost.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client.js";

const CreatePost = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [recipe, setRecipe] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please choose an image");
      return;
    }

    setError("");
    setSubmitting(true);

    const formData = new FormData();
    formData.append("image", file);
    if (caption) formData.append("caption", caption);
    if (recipe) formData.append("recipe", recipe);
    if (location) formData.append("location", location);

    try {
      await api.postForm("/posts", formData);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <h1>New post</h1>

      <form className="stack-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="image">Image</label>
          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="caption">Caption</label>
          <input
            id="caption"
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="recipe">Recipe</label>
          <textarea
            id="recipe"
            value={recipe}
            onChange={(e) => setRecipe(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
