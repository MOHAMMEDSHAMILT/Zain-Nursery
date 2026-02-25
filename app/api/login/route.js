import { setAdminAuth } from '../auth';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        const validEmail = 'Alikka123@gmail.com';
        const validPassword = 'Alikka123';

        if (email === validEmail && password === validPassword) {
            await setAdminAuth();
            return Response.json({ message: 'Login successful' });
        } else {
            return Response.json({ error: 'Invalid email or password' }, { status: 401 });
        }
    } catch (error) {
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
