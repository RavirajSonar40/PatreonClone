import Post from './models/post'; // Assuming you have the Post model in this path

export async function POST(request) {
    try {
        const { postId, userId } = await request.json();
        const post = await Post.findById(postId);

        if (!post) {
            return new Response(JSON.stringify({ error: 'Post not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const hasLiked = post.likes.includes(userId);
        if (hasLiked) {
            // Remove the like
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            // Add the like
            post.likes.push(userId);
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
