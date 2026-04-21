"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // Verify this path matches your lib folder
import { Camera, ChevronLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SellPage() {
  // 1. ALL Hooks and State must be inside the component function
  const [file, setFile] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Cars");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handlePostAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload an image first!");
    
    setLoading(true);

    try {
      // 2. Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Please login to post an ad");

      // 3. Upload Image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 4. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ads')
        .getPublicUrl(fileName);

      // 5. Insert Ad into Database
      const { error: insertError } = await supabase
        .from('ads')
        .insert([{
          title,
          price: parseFloat(price),
          category,
          description,
          image_url: publicUrl,
          user_id: user.id,
          user_email: user.email
        }]);

      if (insertError) throw insertError;

      alert("Ad posted successfully!");
      router.push('/');
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <h1 className="font-bold text-lg text-slate-800 uppercase tracking-tight">Post Your Ad</h1>
          <div className="w-10" />
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 mt-8">
        <form onSubmit={handlePostAd} className="space-y-6">
          
          {/* Image Upload Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <label className="block text-sm font-bold mb-4 text-slate-700 uppercase tracking-wide">Attach Photo</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all bg-slate-50/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="bg-slate-200 p-3 rounded-full mb-3">
                    <Camera className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    {file ? file.name : "Click to upload an image"}
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Ad Title</label>
              <input
                required
                type="text"
                placeholder="What are you selling?"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Price (₹)</label>
                <input
                  required
                  type="number"
                  placeholder="Set a price"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Category</label>
                <select
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all appearance-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Cars</option>
                  <option>Mobiles</option>
                  <option>Bikes</option>
                  <option>Electronics</option>
                  <option>Furniture</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Description</label>
              <textarea
                required
                placeholder="Include condition, features, etc."
                rows={4}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */} 
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" /> POSTING...
              </>
            ) : (
              <>
                POST MY AD NOW 🚀
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}