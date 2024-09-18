const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path as needed
const { faker } = require('@faker-js/faker');

async function generateFakeUsers() {
    try {
        await mongoose.connect('mongodb://0.0.0.0:27017/GetMeVadapav', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Generate fake users with different names
        const users = [...Array(30)].map(() => ({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            profilePicture: faker.image.avatar(),
        }));

        await User.insertMany(users);
        console.log('Users added successfully');
    } catch (err) {
        console.error('Error generating fake users:', err);
    } finally {
        mongoose.disconnect();
    }
}

generateFakeUsers();
