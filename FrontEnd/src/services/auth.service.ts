import type{
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse
} from '../models/auth.model';
import {httpClient} from './main.service';

const entity = 'auth';

//login
export const login = async (payload: LoginRequest) =>
    httpClient.post<LoginResponse>(`/${entity}/login`, payload);

//register
export const register = async (payload: RegisterRequest) =>
    httpClient.post<RegisterResponse>(`/${entity}/register`, payload);