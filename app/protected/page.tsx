"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import { 
  Search, 
  Car, 
  Home as HomeIcon, 
  Bike, 
  Laptop, 
  Smartphone, 
  PlusCircle, 
  Sparkles, 
  Mic, 
  MicOff,
  LogOut,
  User
} from "lucide-react";

export default function ProtectedPage() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  if (!user) return <div className="p-10 font-bold">Loading your profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="p-6 bg-white border-b flex justify-between items-center">
        <h1 className="text-2xl font-black text-blue-600 tracking-tighter">SWAP IT</h1>
        <div className="flex items-center gap-4">
          <span className="font-bold text-slate-600">{user.email}</span>
          <Link href="/" className="bg-slate-100 px-4 py-2 rounded-xl font-bold text-sm">Home</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="bg-blue-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600">
            <User size={40} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">Welcome Back! 🎉</h2>
          <p className="text-slate-500 font-medium mb-8 text-lg">
            You are successfully logged in as <span className="text-blue-600 font-bold">{user.email}</span>.
            Now you can post ads and manage your listings.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sell" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
              <PlusCircle size={20} /> POST A NEW AD
            </Link>
            <Link href="/" className="bg-white border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
              BROWSE MARKETPLACE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}