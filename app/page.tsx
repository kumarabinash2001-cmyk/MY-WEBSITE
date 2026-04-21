"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client"; // ✅ Correct relative path
import { 
  Search, 
  Car, 
  Home as HomeIcon, 
  Bike, 
  Laptop, 
  Smartphone, 
  PlusCircle, 
  LogOut,
  User,
  Mic,
  LayoutGrid
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const supabase = createClient();

  useEffect(() => {
    // 1. Check Auth Status
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    // 2. Fetch Listings from Supabase
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setListings(data);
      setLoading(false);
    };

    checkUser();
    fetchListings();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  // Logic to filter listings based on Search and Category
  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { name: "All", icon: <LayoutGrid />, color: "bg-slate-800" },
    { name: "Cars", icon: <Car />, color: "bg-blue-500" },
    { name: "Properties", icon: <HomeIcon />, color: "bg-emerald-500" },
    { name: "Bikes", icon: <Bike />, color: "bg-orange-500" },
    { name: "Laptops", icon: <Laptop />, color: "bg-purple-500" },
    { name: "Mobiles", icon: <Smartphone />, color: "bg-pink-500" },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-8 py-4 border-b sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="text-3xl font-black tracking-tighter flex items-center">
          <span className="text-blue-600">SWAP</span>
          <span className="text-purple-600 ml-1">IT</span>
        </div>

        <div className="flex items-center gap-6">
          {!user ? (
            <Link href="/login" className="font-bold text-slate-600 hover:text-blue-600 transition-colors">
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-600 flex items-center gap-1">
                <User size={16} /> {user.email?.split('@')[0]}
              </span>
              <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700">
                Logout
              </button>
            </div>
          )}

          <Link href="/sell" className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-2 rounded-full font-bold text-white shadow-md hover:scale-105 transition-all">
            <PlusCircle size={20} /> SELL
          </Link>
        </div>
      </nav>

      {/* --- HERO & SEARCH --- */}
      <section className="bg-slate-50 py-16 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-8">
            Find what you <span className="text-blue-600">need</span>.
          </h1>
          
          <div className="max-w-3xl mx-auto relative flex items-center bg-white rounded-full shadow-xl p-2 border">
            <Search className="ml-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search for cars, bikes, or laptops..." 
              className="w-full px-4 py-3 outline-none font-medium text-slate-700 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* --- CATEGORY SELECTOR --- */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {categories.map((cat) => (
              <button 
                key={cat.name} 
                onClick={() => setSelectedCategory(cat.name)}
                className="flex flex-col items-center group"
              >
                <div className={`${cat.color} p-4 rounded-2xl text-white shadow-lg transition-all ${selectedCategory === cat.name ? 'ring-4 ring-offset-4 ring-slate-900 scale-110' : 'opacity-70 hover:opacity-100'}`}>
                  {cat.icon}
                </div>
                <span className={`mt-2 font-bold text-[10px] uppercase tracking-wider ${selectedCategory === cat.name ? 'text-slate-900' : 'text-slate-400'}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- LISTINGS GRID --- */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-800">
            {selectedCategory === "All" ? "Fresh Recommendations" : `${selectedCategory} for you`}
          </h2>
          <span className="text-sm font-bold text-slate-400">{filteredListings.length} items</span>
        </div>
        
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredListings.length > 0 ? (
              filteredListings.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group cursor-pointer">
                  <div className="h-48 bg-slate-200 relative overflow-hidden">
                    <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-600 shadow-sm">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-2xl font-black text-slate-900">₹{item.price.toLocaleString('en-IN')}</p>
                    <h3 className="font-bold text-slate-600 truncate mt-1">{item.title}</h3>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>SECURE TRANSACTION</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed">
                <p className="text-slate-400 font-bold text-lg">No items match your search. 🔍</p>
                <button onClick={() => {setSearchQuery(""); setSelectedCategory("All")}} className="mt-4 text-blue-600 font-black underline">Show all items</button>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}