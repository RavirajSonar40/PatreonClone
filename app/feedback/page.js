'use client'; // Using client-side rendering

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedbackPage() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [feedback, setFeedback] = useState('');
  const router = useRouter();

  // Fetch users from the API whenever the search query changes
  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(`/api/feedback?query=${query}`);
      const data = await response.json();
      setUsers(data);
    }
    fetchUsers();
  }, [query]);

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    if (!feedback || !selectedUser) return;

    // Submit feedback to the API
    const response = await fetch(`/api/feedback/${selectedUser._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedback }),
    });

    if (response.ok) {
      setFeedback('');
      setSelectedUser(null);
      router.refresh(); // Refresh the page or fetch users again
    } else {
      // Handle error case
      alert('Failed to submit feedback.');
    }
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Feedback Page</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        />
      </div>

      {/* User List or Feedback Form */}
      {selectedUser ? (
        <div className="bg-white p-6 border text-black border-gray-200 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Leave Feedback for {selectedUser.username}</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              required
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
              >
                Submit Feedback
              </button>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-150 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className="bg-white p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer" onClick={() => setSelectedUser(user)}>
                <div className="flex items-center space-x-4">
                  <img
                    src="/icons8-user-48.png"
                    alt={user.username}
                    className="w-12 h-12 rounded-full border-2 border-blue-500"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{user.username}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}
