import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Performance Testing
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Welcome to the performance testing suite. Access the secure login environment to begin your tests.
          </p>
        </div>

        <div>
          <Link href="/login-test" className="inline-block w-full">
            <button className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm">
              <span className="flex items-center gap-2">
                Go to Login Test
                <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}