import { useSession, signIn, signOut } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useState } from "react";
import Link from "next/link";

export default function TestOAuth() {
  const { data: session, status } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setError("");
    
    try {
      const result = await signIn("google", { redirect: false });
      if (result?.error) {
        setError("Failed to sign in. Please try again.");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setError("");
    
    try {
      await signOut({ redirect: false });
    } catch (err) {
      console.error("Sign out error:", err);
      setError("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            OAuth Test Page
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Test your Google OAuth integration
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {session ? (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ✅ Successfully signed in as:
              </h3>
              <div className="flex items-center space-x-3 mb-4">
                {session.user?.image && (
                  <img
                    className="h-12 w-12 rounded-full"
                    src={session.user.image}
                    alt={session.user.name || "User"}
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {session.user?.name}
                  </p>
                  <p className="text-sm text-gray-500">{session.user?.email}</p>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-800">
                  <strong>Status:</strong> OAuth integration is working correctly!
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {isSigningOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing out...
                  </>
                ) : (
                  "Sign out"
                )}
              </button>
              
              <Link
                href="/auth/signout"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Go to sign-out page
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Not signed in
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Click the button below to test the OAuth flow.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {isSigningIn ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign in with Google"
                )}
              </button>
              
              <Link
                href="/auth/signin"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Go to sign-in page
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              This page tests the complete OAuth flow including error handling.
            </p>
            <Link
              href="/"
              className="text-xs text-indigo-600 hover:text-indigo-500 mt-2 inline-block"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};
