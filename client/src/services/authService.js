import axios from "axios";

const BASE_URL = "http://localhost:8000/api/auth";

export async function registerUser({ name, email, password }) {
  const res = await axios.post(`${BASE_URL}/register`, { name, email, password });
  return res.data;
}

export async function loginUser({ email, password }) {
  const res = await axios.post(`${BASE_URL}/login`, { email, password });
  return res.data;
}
export async function resetPassword({ email, newPassword }) {
  const res = await axios.post(`${BASE_URL}/reset-password`, { email, newPassword });
  return res.data;
}
