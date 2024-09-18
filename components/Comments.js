"use client"
import { useState } from 'react';

const Comment = ({ comment, onReply }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleReply = () => {
        onReply(comment.id, replyContent);
        setReplyContent('');
        setShowReplyInput(false);
    };

    return (
        <div className="ml-4 mt-2">
            <p className="text-sm">
                <strong>{comment.author}:</strong> {comment.content}
            </p>
            <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-xs text-blue-500 mt-1 flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a1 1 0 011-1h8a1 1 0 011 1v12a1 1 0 01-1 1H6a1 1 0 01-1-1V3z" />
                    <path d="M4 13a1 1 0 100 2 1 1 0 000-2zM17 13a1 1 0 100 2 1 1 0 000-2zM11 3a1 1 0 00-1 1v12a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1h-4z" />
                </svg>
                Reply
            </button>
            {showReplyInput && (
                <div className="mt-2">
                    <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="border p-1 text-sm"
                        placeholder="Write a reply..."
                    />
                    <button onClick={handleReply} className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        Submit
                    </button>
                </div>
            )}
            {comment.replies && comment.replies.map(reply => (
                <Comment key={reply.id} comment={reply} onReply={onReply} />
            ))}
        </div>
    );
};

export default Comment;
