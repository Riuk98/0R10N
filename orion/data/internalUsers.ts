
export interface OrionUser {
    id: number;
    username: string;
    password: string; // In a real application, this should be a hash.
    role: 'Administrator' | 'User';
}

export const INTERNAL_USERS: OrionUser[] = [
    {
        id: 1,
        username: 'admin',
        password: 'admin',
        role: 'Administrator',
    }
];
