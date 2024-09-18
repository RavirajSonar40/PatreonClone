"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { data: session } = useSession();

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        // Function to handle clicks outside of the dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <nav className="navbar bg-gray-900 text-white flex justify-between p-4">
            <Link href={'/'}>
                <div className='logo font-bold text-xl mx-4 flex justify-center items-center gap-3'>
                    <Image
                        className="flex cursor-pointer w-6 h-6"
                        src="/logo.png"
                        alt="Logo"
                        width={50}
                        height={50}
                    />
                    Patreon
                </div>
            </Link>
            <div>
                {session && (
                    <div className="relative inline-block mx-4 text-left" ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            type="button"
                        >
                            Dropdown divider
                            <svg
                                className="w-2.5 h-2.5 ms-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 4 4 4-4"
                                />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div
                                className="absolute z-50 right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-52 dark:bg-gray-700 dark:divide-gray-600"
                                style={{ zIndex: 9999 }}
                            >
                                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                    <p className="font-semibold">Signed in as:</p>
                                    <p className="text-gray-600 dark:text-gray-400">{session.user.email}</p>
                                </div>
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                    <li>
                                        <Link href={"/posts"} onClick={closeDropdown} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add posts</Link>
                                    </li>
                                    <li>
                                        <Link href={"/getposts"} onClick={closeDropdown} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Explore</Link>
                                    </li>
                                    <li>
                                        <Link href={"/"} onClick={closeDropdown} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Home</Link>
                                    </li>
                                    <li>
                                        <Link href={`${session.user.name}`} onClick={closeDropdown} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Your Page</Link>
                                    </li>
                                    <li>
                                        <Link href={"/feedback"} onClick={closeDropdown} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Feedback</Link>
                                    </li>
                                </ul>
                                <div className="py-2">
                                    <Link href={"/login"} onClick={closeDropdown} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Log in now</Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* {session && (
                    // <Link href="/profile">
                    //     <div className="relative text-center mx-2 inline-flex items-center justify-center px-5 py-3 overflow-hidden font-bold rounded-lg group">
                    //         <span className="absolute inset-0 bg-white opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100"></span>
                    //         <span className="relative text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900 z-10">Profile</span>
                    //         <span className="absolute inset-0 border-2 border-white rounded-lg"></span>
                    //     </div>
                    // </Link>
                )} */}

<Link href={"/polls"}>
                <button
                            type="button"
                            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            Polls 
                        </button>
                </Link>

                <Link href={"/discussions"}>
                <button
                            type="button"
                            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            Discussion forums
                        </button>
                </Link>


                {session && (
                    <Link href="/">
                         <button
                            type="button"
                            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                           log out
                        </button>
                    </Link>
                )}

                {!session && (
                    <Link href="/login">
                        <button
                            type="button"
                            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            Login now
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
