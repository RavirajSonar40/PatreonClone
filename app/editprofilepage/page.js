"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";

const EditProfilePage = () => {
    const router = useRouter();

    const [profilePic, setProfilePic] = useState("");
    const [coverPic, setCoverPic] = useState("");
    const [slogan, setSlogan] = useState("");
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        const fetchSessionAndUserData = async () => {
            try {
                const session = await getSession();
                if (!session) {
                    router.push("/login"); // Redirect to login if not authenticated
                    return;
                }
                setSession(session);

                const response = await fetch("/api/getUserProfile");
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await response.json();
                setProfilePic(data.profilePic || "");
                setCoverPic(data.coverPic || "");
                setSlogan(data.slogan || "");
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };

        fetchSessionAndUserData();
    }, [router]);

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetch("/api/updateProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ profilePic, coverPic, slogan }),
            });

            toast.success("Profile updated successfully");
            router.push(`/${session.user.name}`); // Redirect to the user's profile page after updating
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Show loading spinner while fetching data
    }

    return (
        <div className="container mx-auto p-4 text-black">
            <h1 className="text-2xl font-bold mb-4 text-white">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-lg font-medium mb-1">Profile Picture URL</label>
                    <input
                        type="text"
                        value={profilePic}
                        onChange={(e) => setProfilePic(e.target.value)}
                        className="p-2 border rounded w-full"
                        placeholder="Enter profile picture URL"
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium mb-1">Cover Picture URL</label>
                    <input
                        type="text"
                        value={coverPic}
                        onChange={(e) => setCoverPic(e.target.value)}
                        className="p-2 border rounded w-full"
                        placeholder="Enter cover picture URL"
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium mb-1">Slogan</label>
                    <input
                        type="text"
                        value={slogan}
                        onChange={(e) => setSlogan(e.target.value)}
                        className="p-2 border rounded w-full"
                        placeholder="Enter your slogan"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default EditProfilePage;
