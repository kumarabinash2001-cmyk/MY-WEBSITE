"use client";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client"; // ✅ Correct relative path
import Link from "next/link";

export default function ProfilePage() {
  const [myListings, setMyListings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("listings")
          .select("*")
          .eq("user_id", user.id); // Only fetch items posted by THIS user
        if (data) setMyListings(data);
      }
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-2">My Profile 👤</h1>
        <p className="text-slate-500 mb-8 font-medium">{user?.email}</p>

        <h2 className="text-xl font-bold mb-4">Your Active Listings</h2>
        <div className="grid gap-4">
          {myListings.length > 0 ? myListings.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-2xl">
              <div className="flex items-center gap-4">
                <img src={item.image_url} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-blue-600 font-black">₹{item.price}</p>
                </div>
              </div>
              <button className="text-red-500 font-bold text-sm">Delete</button>
            </div>
          )) : (
            <p className="text-slate-400">You haven't posted anything yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}