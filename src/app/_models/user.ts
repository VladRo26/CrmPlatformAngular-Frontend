export interface User {
    userName: string;
    token: string;
    photoUrl?: string | null;
    userType: string;
    roles: string[];
}