const { MongoClient } = require('mongodb');

// MongoDB URI
const uri = 'mongodb://0.0.0.0:27017/GetMeVadapav';

// Function to generate fake polls
const generateFakePolls = (numPolls) => {
  const sampleQuestions = [
    'What is your favorite color?',
    'What is your preferred mode of transportation?',
    'Which is your favorite season?',
    'What type of music do you prefer?',
    'Which programming language do you like best?'
  ];

  const sampleOptions = [
    ['Red', 'Blue', 'Green', 'Yellow'],
    ['Car', 'Bike', 'Bus', 'Train'],
    ['Spring', 'Summer', 'Fall', 'Winter'],
    ['Rock', 'Pop', 'Jazz', 'Classical'],
    ['JavaScript', 'Python', 'Java', 'C++']
  ];

  const fakePolls = [];
  
  for (let i = 0; i < numPolls; i++) {
    const questionIndex = Math.floor(Math.random() * sampleQuestions.length);
    const options = sampleOptions[questionIndex];
    
    const votes = options.map(() => Math.floor(Math.random() * 100));

    fakePolls.push({
      question: sampleQuestions[questionIndex],
      options: options,
      votes: votes
    });
  }

  return fakePolls;
};

// Function to insert fake polls into MongoDB
const insertFakePolls = async () => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(); // Use the default database from the URI
    const collection = database.collection('polls'); // Replace with your collection name

    const fakePolls = generateFakePolls(15); // Generate 15 fake polls
    const result = await collection.insertMany(fakePolls);

    console.log(`${result.insertedCount} fake polls inserted`);
  } catch (error) {
    console.error('Error inserting fake polls', error);
  } finally {
    await client.close();
  }
};

insertFakePolls();
