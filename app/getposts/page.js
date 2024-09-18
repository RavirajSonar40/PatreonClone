"use client";
import { useState, useEffect } from 'react';
import Comment from '@/components/Comments'; // Make sure this path is correct
import Link from 'next/link';

const MAX_LIKES_PER_USER = 10;

const PostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [activePostId, setActivePostId] = useState(null);
    const [postsearchQuery, setpostSearchQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [creators, setCreators] = useState([]);
    const [filteredCreators, setFilteredCreators] = useState([]);

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = posts.filter(post =>
            post.title?.toLowerCase().includes(lowercasedQuery) ||
            (post.creator && post.creator.toLowerCase().includes(lowercasedQuery)) // Search by creator
        );
        setFilteredPosts(filtered);
    }, [searchQuery, posts]);


    useEffect(() => {
        const fetchPostsAndCreators = async () => {
            try {
                const postsResponse = await fetch('/api/getposts');
                const creatorsResponse = await fetch('/api/getcreators');

                if (postsResponse.ok && creatorsResponse.ok) {
                    const postsData = await postsResponse.json();
                    const creatorsData = await creatorsResponse.json();

                    const postsWithLikeCount = postsData.map(post => ({
                        ...post,
                        likeCount: parseInt(localStorage.getItem(`post_${post._id}_likes`) || '0', 10),
                        userLikes: parseInt(localStorage.getItem(`user_likes_${post._id}`) || '0', 10),
                        comments: JSON.parse(localStorage.getItem(`post_${post._id}_comments`) || '[]')
                    }));
                    setPosts(postsWithLikeCount);
                    setFilteredPosts(postsWithLikeCount);

                    setCreators(creatorsData);
                    setFilteredCreators(creatorsData);
                } else {
                    console.error('Failed to fetch posts or creators');
                }
            } catch (error) {
                console.error('Error fetching posts and creators:', error);
            }
        };

        fetchPostsAndCreators();
    }, []);

    useEffect(() => {
        // Define lowercasedQuery inside useEffect
        const lowercasedQuery = searchQuery.toLowerCase();
        // Filter creators based on the lowercased search query
        const filtered = creators.filter(creator =>
            creator.username?.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredCreators(filtered);
    }, [searchQuery, creators]); // Re-run the effect if searchQuery or creators change




    const handleLike = (postId) => {
        setPosts(prevPosts => {
            const updatedPosts = prevPosts.map(post => {
                if (post._id === postId && post.userLikes < MAX_LIKES_PER_USER) {
                    const newLikeCount = post.likeCount + 1;
                    const newUserLikes = post.userLikes + 1;

                    // Directly update the state for live updates
                    return { ...post, likeCount: newLikeCount, userLikes: newUserLikes };
                }
                return post;
            });

            // Sync to localStorage after state update
            updatedPosts.forEach(post => {
                localStorage.setItem(`post_${post._id}_likes`, post.likeCount.toString());
                localStorage.setItem(`user_likes_${post._id}`, post.userLikes.toString());
            });

            // Return the updated posts array to trigger a re-render
            return updatedPosts;
        });
    };


    const syncPostsWithLocalStorage = () => {
        setPosts(prevPosts => {
            const updatedPosts = prevPosts.map(post => {
                const likeCount = parseInt(localStorage.getItem(`post_${post._id}_likes`) || '0', 10);
                const userLikes = parseInt(localStorage.getItem(`user_likes_${post._id}`) || '0', 10);
                const comments = JSON.parse(localStorage.getItem(`post_${post._id}_comments`) || '[]');

                return { ...post, likeCount, userLikes, comments };
            });

            return updatedPosts;
        });
    };


    const handleComment = (postId) => {
        if (commentContent.trim()) {
            setPosts(prevPosts => {
                const updatedPosts = prevPosts.map(post => {
                    if (post._id === postId) {
                        const newComment = {
                            id: Date.now(),
                            author: 'Anonymous User',
                            content: commentContent,
                            replies: []
                        };
                        const newComments = [...post.comments, newComment];

                        // Directly update the state for live updates
                        return { ...post, comments: newComments };
                    }
                    return post;
                });

                // Sync to localStorage after state update
                updatedPosts.forEach(post => {
                    localStorage.setItem(`post_${post._id}_comments`, JSON.stringify(post.comments));
                });

                // Clear the comment input field
                setCommentContent('');

                return updatedPosts;
            });
        }
    };


    const handleReply = (postId, commentId, replyContent) => {
        setPosts(posts.map(post => {
            if (post._id === postId) {
                const newComments = post.comments.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies: [...(comment.replies || []), {
                                id: Date.now(),
                                author: 'Anonymous User',
                                content: replyContent
                            }]
                        };
                    }
                    return comment;
                });
                localStorage.setItem(`post_${postId}_comments`, JSON.stringify(newComments));
                return { ...post, comments: newComments };
            }
            return post;
        }));
    };

    useEffect(() => {
        const handleStorageChange = () => {
            syncPostsWithLocalStorage();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const toggleComments = (postId) => {
        setActivePostId(activePostId === postId ? null : postId);
    };

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = posts.filter(post =>
            post.title?.toLowerCase().includes(lowercasedQuery) ||
            post.content?.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredPosts(filtered);
    }, [searchQuery, posts]);

    return (
        <div className="container gap-4 mx-auto p-4 text-black my-5  flex" style={{ maxWidth: '90%' }}>
            <div className="w-1/3 bg-gray-100 p-4 rounded-lg scrollbar-thin overflow-y-auto h-[calc(100vh-2rem)]">
                {/* Left half content */}
                <h1 className="text-2xl font-bold mb-4">Search for Your Creator</h1>
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
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </form>
                <p className="text-gray-500">Here you can search for your creator's account.</p>
                <div className='my-5'>
                    {filteredCreators.length === 0 ? (
                        <p className="text-gray-500">No creators available.</p>
                    ) : (
                        <ul>
                            {filteredCreators.map(creator => (
                                <li key={creator._id} className="flex m-3 items-center mb-4">
                                    <Link href={`/${creator.username}`} className="flex items-center">
                                        <img
                                            className="w-8 h-8 rounded-full mr-4"
                                            src={creator.profilePicture || '/icons8-user-48.png'}
                                            alt={`${creator.username}'s avatar`}
                                        />
                                        <span className="text-lg text-black font-semibold">{creator.username}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>


            </div>


            <div className="w-2/3 bg-white rounded-lg p-4 ml-4 scrollbar-thin overflow-y-auto h-[calc(100vh-2rem)]">
                {/* Right half for posts */}
                <h1 className="text-2xl font-bold mb-4">Posts</h1>
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
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </form>


                {filteredPosts.length === 0 ? (
                    <p className="text-gray-500">No posts available.</p>
                ) : (
                    <div className="space-y-4">
                        {filteredPosts.map(post => (
                            <div key={post._id} className="bg-white p-4 text-black rounded-lg shadow-sm">
                                <div className="flex items-center mb-4">
                                    <img
                                        className="w-12 h-12 rounded-full mr-4"
                                        src="/icons8-user-48.png"
                                        alt={`${post.creator || 'Anonymous'}'s avatar`}
                                    />
                                    <div>
                                        <h2 className="text-xl text-black font-semibold">{post.creator || 'Anonymous'}</h2>
                                        <p className="text-gray-500 text-sm">
                                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown Date'}
                                        </p>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-black mb-2">{post.title || 'Untitled'}</h3>
                                <p className="text-gray-700 text-sm mb-4">{post.content || 'No content available.'}</p>
                                {post.imageUrl && <img className="w-full h-auto mb-4 rounded" src={post.imageUrl} alt={post.title || 'Post image'} />}
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => handleLike(post._id)}
                                            className={`p-2 rounded-full focus:outline-none ${post.userLikes < MAX_LIKES_PER_USER ? 'hover:bg-red-100' : 'cursor-not-allowed'
                                                }`}
                                            disabled={post.userLikes >= MAX_LIKES_PER_USER}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill={post.userLikes > 0 ? 'red' : 'none'} stroke="currentColor">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                        </button>


                                        <span className="text-base text-gray-600">{post.likeCount} {post.likeCount === 1 ? 'Like' : 'Likes'}</span>
                                        <span className="text-sm text-gray-500">({post.userLikes}/{MAX_LIKES_PER_USER})</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src="/icons8-comments-48.png"
                                            alt="Comments"
                                            onClick={() => toggleComments(post._id)}
                                            className="w-6 h-6 cursor-pointer"
                                        />
                                        <span className="text-xs text-blue-500">
                                            {activePostId === post._id ? 'Hide Comments' : 'Show Comments'}
                                        </span>
                                    </div>
                                </div>
                                {activePostId === post._id && (
                                    <>
                                        <div className="mt-4">
                                            <h4 className="font-semibold mb-2">Comments</h4>
                                            {post.comments.map(comment => (
                                                <Comment key={comment.id} comment={comment} onReply={(commentId, content) => handleReply(post._id, commentId, content)} />
                                            ))}
                                            <div className="mt-2 text-black">
                                                <input
                                                    type="text"
                                                    value={commentContent}
                                                    onChange={(e) => setCommentContent(e.target.value)}
                                                    className="border p-2 w-full"
                                                    placeholder="Write a comment..."
                                                />
                                                <button onClick={() => handleComment(post._id)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                                                    Comment
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default PostsPage;
