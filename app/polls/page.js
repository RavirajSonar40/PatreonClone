// components/PollPage.jsx
"use client";
import { useState, useEffect } from 'react';
import styles from './PollPage.module.css'; // Import the CSS module

const PollPage = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [polls, setPolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState(new Set()); // Track voted polls
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await fetch('/api/polls');
      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.error('Failed to fetch polls', error);
    }
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async () => {
    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          options: options.filter(option => option),
          creatorName: 'Your Name', // Replace with actual creator's name
          creatorProfile: 'http://example.com/profile.jpg' // Replace with actual creator's profile URL
        }),
      });

      if (response.ok) {
        const newPoll = await response.json();
        setPolls([...polls, newPoll]);
        setQuestion('');
        setOptions(['', '']);
      } else {
        console.error('Failed to create poll');
      }
    } catch (error) {
      console.error('Failed to create poll', error);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    if (votedPolls.has(pollId)) {
      return; // Prevent voting if already voted
    }

    try {
      const response = await fetch('/api/polls', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pollId, optionIndex }),
      });

      if (response.ok) {
        const updatedPoll = await response.json();
        setPolls(polls.map(poll => poll._id === pollId ? updatedPoll : poll));
        setVotedPolls(new Set(votedPolls.add(pollId))); // Mark poll as voted
      } else {
        console.error('Failed to update poll');
      }
    } catch (error) {
      console.error('Failed to update poll', error);
    }
  };

  const calculatePercentage = (pollIndex, optionIndex) => {
    const poll = polls[pollIndex];
    const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
    return totalVotes === 0 ? 0 : ((poll.votes[optionIndex] / totalVotes) * 100).toFixed(2);
  };

  // Filter polls based on search query
  const filteredPolls = polls.filter(poll =>
    poll.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.createPollSection}>
        <h1 className={styles.heading}>Create a Poll</h1>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={styles.input}
          />
          <div className={styles.optionsContainer}>
            {options.map((option, index) => (
              <div key={index} className={styles.option}>
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className={styles.input}
                />
              </div>
            ))}
          </div>
          <div className='flex gap-14'>
            <button onClick={handleAddOption} className={styles.addButton}>
              Add Option
            </button>
            <button onClick={handleCreatePoll} className={styles.button}>
              Create Poll
            </button>
          </div>
        </div>
      </div>

      <div className={styles.activePollsSection}>
        <h2 className={styles.heading}>Active Polls</h2>
        <div>
          <form className="relative mb-4">
            <button
              type="submit"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1"
              aria-label="Search"
            >
              <svg
                width="17"
                height="16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-labelledby="search"
                className="w-5 h-5 text-gray-700"
              >
                <path
                  d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="1.333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
            <input
              type="text"
              className="rounded-full px-10 py-3 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md"
              placeholder="Search..."
              required
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="reset"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
              aria-label="Clear"
              onClick={() => setSearchQuery('')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                role="img"
                aria-labelledby="clear"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </form>
        </div>
        <div className={styles.pollsList}>
          {filteredPolls.map((poll, pollIndex) => (
            <div key={poll._id} className={styles.poll}>
              <div className={styles.pollHeader}>
                <img
                  src="/icons8-user-48.png"
                  alt={`${poll.creatorName}'s profile`}
                  className={styles.creatorProfile}
                />
                <div className={styles.creatorInfo}>
                  <h1 className={styles.creatorName}>Anonymous</h1>
                </div>
              </div>
              <h3 className={styles.question}>{poll.question}</h3>
              <div className={styles.optionsContainer}>
                {poll.options.map((option, optionIndex) => (
                  <div key={optionIndex} className={styles.option}>
                    <button
                      onClick={() => handleVote(poll._id, optionIndex)}
                      className={styles.voteButton}
                      disabled={votedPolls.has(poll._id)} // Disable voting if already voted
                    >
                      {option}
                    </button>
                    <span className={styles.percentage}>{calculatePercentage(pollIndex, optionIndex)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PollPage;
