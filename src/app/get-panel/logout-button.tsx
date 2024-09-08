"use client"
import { signOut } from "next-auth/react"

const LogoutButton = () => {
    return (
        <button onClick={() => signOut()}>Sign out</button>
    )
}

export default LogoutButton;