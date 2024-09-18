import User from '@/models/User'; // Adjust according to your file structure
import { getSession } from 'next-auth/react'; // Ensure you have the correct session handling library

export async function GET(request) {
    try {
        console.log('Fetching session...');
        const session = await getSession({ req: request });
        console.log('Session:', session);

        if (!session || !session.user || !session.user.id) {
            console.error('User not authenticated or user ID missing');
            return new Response(JSON.stringify({ error: 'User not authenticated' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = await User.findById(session.user.id).select('userId');
        console.log('User:', user);

        if (!user) {
            console.error('User not found');
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log('Returning user ID:', user.userId);
        return new Response(JSON.stringify({ userId: user.userId }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching user ID:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch user ID' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
