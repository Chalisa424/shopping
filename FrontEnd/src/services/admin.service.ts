import type{ LoginRequest, LoginResponse } from '../models/auth.model';
import axios from "axios";

const baseURL = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_DIR}`;

export const adminLogin = (payload: LoginRequest) =>{
 const basicToken = btoa(`${payload.username}:${payload.password}`);

  return axios.get<LoginResponse>(`${baseURL}/admin/login`, {
    headers: {
      Authorization: `Basic ${basicToken}`,
    },
  });
};