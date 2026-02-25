import { cookies } from 'next/headers';

const ADMIN_TOKEN = 'alikka-admin-secret-token-2026'; // In a real app, this would be an env var

export async function isAuthenticated() {
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken');
    return token?.value === ADMIN_TOKEN;
}

export async function setAdminAuth() {
    const cookieStore = await cookies();
    cookieStore.set('adminToken', ADMIN_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
    });
}
