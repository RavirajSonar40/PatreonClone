// scripts/addPosts.js

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://0.0.0.0:27017/GetMeVadapav';

const postSchema = new mongoose.Schema({
    creator: String,
    title: String,
    image:String,
    content: String,
    date: Date,
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

async function run() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const posts = [
            { creator: 'Alice', content: 'This is Alice\'s first post!', date: new Date() },
            { creator: 'Bob', content: 'Bob here, sharing some thoughts.', date: new Date() },
            { creator: 'Charlie', content: 'Charlie is joining the conversation.', date: new Date() },
        ];

        for (const post of posts) {
            await Post.create(post);
            console.log(`Added post: ${post.content}`);
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error adding posts:', error);
    }
}

run();
