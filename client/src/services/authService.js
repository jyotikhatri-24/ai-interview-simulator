import axios from "axios";
import API_BASE_URL from "../config";

const BASE_URL = `${API_BASE_URL}/auth`;

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
