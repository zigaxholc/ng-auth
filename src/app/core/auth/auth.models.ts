export interface User {
    id: string;
    email: string;
    name: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}
