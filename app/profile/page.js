"use client"
import React from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'

const Profile = () => {
  const { data: session } = useSession();
  if(!session) { 
    const route=useRouter()
    route.push("/login")
  }

  return (
    <>
    <div>
      Profile
    </div>
    </>
  );
}

export default Profile;
