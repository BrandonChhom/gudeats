// codeProjects/gudeats/frontend/src/api/client.js

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/*
The auth token lives in an httpOnly cookie, so the browser attaches it for us.
Every request needs credentials: "include" or that cookie is silently dropped
on cross-origin calls and the API sees an anonymous request.
*/
const request = async (path, { method = "GET", body, isFormData = false } = {}) => {
  const options = {
    method,
    credentials: "include",
    headers: {},
  };

  if (body !== undefined) {
    if (isFormData) {
      // let the browser set the multipart boundary itself
      options.body = body;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, options);
  } catch {
    throw new Error("Could not reach the server");
  }

  // 204s and empty bodies have nothing to parse
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error?.message || "Something went wrong");
  }

  return data;
};

const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  postForm: (path, formData) =>
    request(path, { method: "POST", body: formData, isFormData: true }),
  del: (path) => request(path, { method: "DELETE" }),
};

export default api;
