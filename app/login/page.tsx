"use client";
import { useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  
  const supabase = createClient();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message as any);
    } else {
      router.push("/"); // Redirect to home after success
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <h1 className="text-3xl font-black text-center mb-8">
          {isSignUp ? "Create Account" : "Welcome Back"} 🔄
        </h1>

        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" placeholder="Email" 
            className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          
          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all">
            {isSignUp ? "SIGN UP" : "LOGIN"}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <hr /> <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-slate-400 text-sm font-bold">OR</span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full py-4 border-2 border-slate-100 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5" alt="Google" />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-slate-500 font-medium">
          {isSignUp ? "Already have an account?" : "New to SwapIt?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 font-black underline">
            {isSignUp ? "Login" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}