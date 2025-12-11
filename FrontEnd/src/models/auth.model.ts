//เรียก /api/login
export type Role = 'USER' | 'ADMIN';

export interface LoginRequest {
    username: string;
    password: string;
}

//เรียก /api/auth/register
export interface RegisterRequest extends LoginRequest{
    fullName: string;
    phone: string;
    confirmPassword: string;
    role: Role;
}

//response จาก /api/login
export interface LoginResponse {
    token: string;
    username: string;
    role: Role;
}

//response จาก register
export interface RegisterResponse {
    id: number;
    username: string;
    fullName: string;
    phone: string;
    role: Role;
}

//ข้อมูลผู้ใช้งานหลัง login
export interface Me {
    id: number;
    username: string;
    fullname: string;
    phone: string;
    role: Role;
}
