"use client";
import { useState } from 'react';

const AdminPage = () => {
    const [creator, setCreator] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creator, title, content, image }),
        });

        if (response.ok) {
            alert('Post added successfully!');
            setCreator('');
            setTitle('');
            setContent('');
            setImage('');
        } else {
            alert('Error adding post.');
        }
    };

    return (
        <div className="container mx-auto p-6 text-black py-10 my-9 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Add a Post</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="creator" className="text-lg font-semibold text-gray-700 mb-2">Creator:</label>
                    <input
                        id="creator"
                        name="creator"
                        type="text"
                        value={creator}
                        onChange={(e) => setCreator(e.target.value)}
                        required
                        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="title" className="text-lg font-semibold text-gray-700 mb-2">Title:</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="content" className="text-lg font-semibold text-gray-700 mb-2">Content:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="image" className="text-lg font-semibold text-gray-700 mb-2">Image URL:</label>
                    <input
                        id="image"
                        name="image"
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition duration-300"
                >
                    Add Post
                </button>
            </form>
        </div>
    );
};

export default AdminPage;
