//เรียก /api/login
export interface LoginRequest {
    username: string;
    password: string;
}

//เรียก /api/auth/register
export interface RegisterRequest {
    username: string;
    fullname: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: string;
}

//response จาก /api/login
export interface LoginResponse {
    token: string;
    username: string;
    role: string;
}

//response จาก register
export interface RegisterResponse {
    id: number;
    username: string;
    fullname: string;
    phone: string;
    role: string;
}

