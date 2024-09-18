import Post from '@/models/Post';
import mongoose from 'mongoose';

export async function POST(request) {
    try {
        const { postId, userId } = await request.json();
        console.log("Received userId:", userId); // Debugging purpose

        // Ensure the userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Invalid userId:', userId); // Debugging purpose
            return new Response(JSON.stringify({ error: 'Invalid userId' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return new Response(JSON.stringify({ error: 'Post not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Convert userId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const hasLiked = post.likes.some(id => id.equals(userObjectId));
        if (hasLiked) {
            // Remove the like
            post.likes = post.likes.filter(id => !id.equals(userObjectId));
        } else {
            // Add the like
            post.likes.push(userObjectId);
        }

        await post.save();

        return new Response(JSON.stringify({
            likes: post.likes,
            message: hasLiked ? 'Like removed' : 'Liked successfully',
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error handling like:', error);
        return new Response(JSON.stringify({ error: 'Failed to process like' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
