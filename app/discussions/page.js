'use client';

import { useState, useEffect } from 'react';

export default function DiscussionPage() {
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [newComments, setNewComments] = useState({});
  const [replyComments, setReplyComments] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [openReplies, setOpenReplies] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDiscussions();
    initializeComments();
  }, []);

  const fetchDiscussions = async () => {
    const res = await fetch('/api/discussions');
    if (res.ok) {
      const data = await res.json();
      setDiscussions(data);
      syncDiscussionsWithLocalStorage(data);
    } else {
      console.error('Failed to fetch discussions:', await res.text());
    }
  };

  const initializeComments = () => {
    const savedComments = localStorage.getItem('comments');
    if (savedComments) {
      setNewComments(JSON.parse(savedComments));
    }
  };

  const saveDiscussionsToLocalStorage = (discussions) => {
    localStorage.setItem('discussions', JSON.stringify(discussions));
  };

  const syncDiscussionsWithLocalStorage = (discussions) => {
    const savedDiscussions = JSON.parse(localStorage.getItem('discussions')) || [];
    const discussionsWithComments = discussions.map(discussion => {
      const savedDiscussion = savedDiscussions.find(d => d._id === discussion._id);
      return {
        ...discussion,
        comments: savedDiscussion ? savedDiscussion.comments : discussion.comments
      };
    });
    setDiscussions(discussionsWithComments);
    saveDiscussionsToLocalStorage(discussionsWithComments);
  };

  const handleNewDiscussion = async (e) => {
    e.preventDefault();
    const { title, content } = newDiscussion;

    if (!title.trim() || !content.trim()) return;

    const res = await fetch('/api/discussions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, creator: { name: 'Anonymous', avatar: 'default-avatar-url' } }),
    });

    if (res.ok) {
      setNewDiscussion({ title: '', content: '' });
      fetchDiscussions();
    } else {
      console.error('Failed to create discussion:', await res.text());
    }
  };

  const handleNewComment = (e, discussionId) => {
    e.preventDefault();
    const commentContent = newComments[discussionId] || '';

    if (!commentContent.trim()) return;

    const updatedDiscussions = discussions.map((discussion) => {
      if (discussion._id === discussionId) {
        return {
          ...discussion,
          comments: [...discussion.comments, { _id: Date.now(), author: 'Anonymous', content: commentContent }],
        };
      }
      return discussion;
    });

    setDiscussions(updatedDiscussions);
    setNewComments((prev) => ({ ...prev, [discussionId]: '' }));

    saveDiscussionsToLocalStorage(updatedDiscussions);
  };

  const handleReplyComment = (e, discussionId, commentId) => {
    e.preventDefault();
    const replyContent = replyComments[`${discussionId}-${commentId}`] || '';

    if (!replyContent.trim()) return;

    const updatedDiscussions = discussions.map((discussion) => {
      if (discussion._id === discussionId) {
        const updatedComments = discussion.comments.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), { _id: Date.now(), author: 'Anonymous', content: replyContent }]
            };
          }
          return comment;
        });
        return { ...discussion, comments: updatedComments };
      }
      return discussion;
    });

    setDiscussions(updatedDiscussions);
    setReplyComments((prev) => ({ ...prev, [`${discussionId}-${commentId}`]: '' }));

    saveDiscussionsToLocalStorage(updatedDiscussions);
  };

  const toggleComments = (discussionId) => {
    setOpenComments(prev => ({ ...prev, [discussionId]: !prev[discussionId] }));
  };

  const toggleReplies = (discussionId, commentId) => {
    setOpenReplies(prev => ({ ...prev, [`${discussionId}-${commentId}`]: !prev[`${discussionId}-${commentId}`] }));
  };

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-5 font-sans text-gray-800 flex gap-5">
      <div className="w-full lg:w-1/3 bg-gray-100 rounded-lg p-5 h-screen max-h-screen overflow-y-auto">
        <h2 className="text-xl text-gray-800 mb-5 border-b-2 pb-2 border-gray-200">Add New Discussion</h2>
        <form className="space-y-4" onSubmit={handleNewDiscussion}>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Title"
            value={newDiscussion.title}
            onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
          />
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg text-sm h-24 resize-y"
            placeholder="Content"
            value={newDiscussion.content}
            onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
          />
          <button type="submit" className="bg-blue-600 text-white mx-3 px-3 py-2 rounded-lg text-sm hover:bg-blue-700 mt-4">Add Discussion</button>
        </form>
      </div>
      <div className="w-full lg:w-2/3">
        <h2 className="text-xl text-gray-800 mb-5 border-b-2 pb-2 border-gray-200">All Discussions</h2>

        <form className="form relative mb-5">
          <button className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a7 7 0 100 14 7 7 0 000-14zm0 10a3 3 0 110-6 3 3 0 010 6z" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search Discussions..."
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {filteredDiscussions.map(discussion => (
          <div key={discussion._id} className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <img
                src="/icons8-user-48.png"
                alt={discussion.creator.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <p className="font-semibold text-2xl text-gray-800">Anonymous</p>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{discussion.title}</h3>
            <p className="text-gray-700">{discussion.content}</p>

            {/* Comments Section */}
            <div>
              <button
                onClick={() => toggleComments(discussion._id)}
                className="text-blue-600 hover:underline"
              >
                {openComments[discussion._id] ? 'Hide Comments' : 'Show Comments'}
              </button>
              {openComments[discussion._id] && (
                <div>
                  {discussion.comments.map(comment => (
                    <div key={comment._id} className="border-t border-gray-200 mt-3 pt-3">
                      <div className="flex items-center mb-2">
                        <img
                          src="/icons8-user-48.png"// Use a default avatar or implement dynamic avatars
                          alt={comment.author}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <p className="font-semibold text-gray-800">Anonymous</p>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>

                      {/* Replies Section */}
                      <button
                        onClick={() => toggleReplies(discussion._id, comment._id)}
                        className="text-blue-600 hover:underline mt-2 block"
                      >
                        {openReplies[`${discussion._id}-${comment._id}`] ? 'Hide Replies' : 'Show Replies'}
                      </button>
                      {openReplies[`${discussion._id}-${comment._id}`] && (
                        <div className="mt-2 ml-4">
                          {comment.replies?.map(reply => (
                            <div key={reply._id} className="flex items-center mb-2">
                              <img
                                src="default-avatar-url" // Use a default avatar or implement dynamic avatars
                                alt={reply.author}
                                className="w-6 h-6 rounded-full mr-3"
                              />
                              <p className="font-semibold text-gray-800">{reply.author}</p>
                              <p className="text-gray-700">{reply.content}</p>
                            </div>
                          ))}
                          <form onSubmit={(e) => handleReplyComment(e, discussion._id, comment._id)}>
                            <input
                              type="text"
                              placeholder="Reply..."
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                              value={replyComments[`${discussion._id}-${comment._id}`] || ''}
                              onChange={(e) => setReplyComments({ ...replyComments, [`${discussion._id}-${comment._id}`]: e.target.value })}
                            />
                            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm mt-2 hover:bg-blue-700">Reply</button>
                          </form>
                        </div>
                      )}
                    </div>
                  ))}
                  <form onSubmit={(e) => handleNewComment(e, discussion._id)}>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm mt-3"
                      value={newComments[discussion._id] || ''}
                      onChange={(e) => setNewComments({ ...newComments, [discussion._id]: e.target.value })}
                    />
                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm mt-2 hover:bg-blue-700">Comment</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
