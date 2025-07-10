"use client"
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { useState } from 'react'

async function login(username: string, password : string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Invalid credentials");

  const { token } = await res.json();
  Cookies.set("token", token, { expires: 7 });
}

export default function Login() {
    const router = useRouter();
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            await login(username, password);
            router.push("/dashboard")
        }
        catch (error : unknown) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
            else {
                setErrorMessage("An unknown error has occurred.")
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 text-white">
            <div className="border rounded-md p-12 w-[30%]">
                <h1 className="text-white text-2xl font-bold mb-4">Login</h1>
                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input
                        className="w-full border rounded-md p-1 my-2"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label>Password</label>
                    <input
                        className="w-full border rounded-md p-1 my-2"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="border rounded-md p-2 mt-4"
                    >
                        Sign In
                    </button>
                </form>
                {errorMessage && <p className="text-red-400 mt-4">{errorMessage}</p>}
            </div>
        </div>
    )
}
