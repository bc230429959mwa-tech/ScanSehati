"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSignup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    if (res.ok) {
      router.push('/admin/login');
    } else {
      const data = await res.json();
      setError(data.error || 'Signup failed');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold mb-4">Admin Signup</h1>
        {error && <div className="text-red-500">{error}</div>}
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className="w-full border rounded px-3 py-2" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border rounded px-3 py-2" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Sign Up</button>
      </form>
    </main>
  );
}
