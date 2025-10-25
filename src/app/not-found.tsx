'use client';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-600 mb-6 text-lg">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <button
        onClick={() => {
          if (window.history.length > 1) router.back();
          else router.push('/');
        }}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Go Back
      </button>
    </main>
  );
}
