// src/components/ProfilePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { User, Package, Clock, CheckCircle, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Display name: prefer full_name from metadata, fallback to email prefix
  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  // Dummy orders — replace with real Supabase query later
  const orders = [
    { id: "ORD-001", date: "2024-01-15", type: "35mm x 45mm Photos", status: "completed", price: "$24.99", delivery: "Digital Download" },
    { id: "ORD-002", date: "2024-01-10", type: "50mm x 50mm Photos", status: "processing", price: "$19.99", delivery: "Print + Digital" },
    { id: "ORD-003", date: "2024-01-05", type: "38mm x 48mm Photos", status: "completed", price: "$29.99", delivery: "Express Shipping" },
  ];

  return (
    <div className="min-h-screen grain-overlay bg-retro-cream/50">
      <Navigation isLandingPage={false} />
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-retro-red border-[3px] border-retro-dark rounded-lg px-4 py-1.5 shadow-retro-sm mb-6">
              <User className="w-4 h-4 text-retro-cream" />
              <span className="font-display text-sm tracking-wider text-retro-cream">PROFILE</span>
            </div>
            <h1 className="font-display text-[3rem] md:text-[4.5rem] text-retro-dark leading-[0.9] mb-6 tracking-tight">
              WELCOME,
              <br />
              <span className="font-display-serif italic text-retro-red text-[2rem] md:text-[3rem]">
                {displayName}
              </span>
            </h1>
            <p className="text-retro-dark-mid text-lg max-w-2xl mx-auto font-medium mb-2">
              {user?.email}
            </p>
            <p className="text-retro-dark-mid text-base max-w-2xl mx-auto font-medium mb-12">
              View your order history and manage your PhotoID Pro account
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6">
              {orders.map((order) => (
                <div key={order.id} className="sticker bg-retro-cream rounded-xl p-6 shadow-retro-lg border-[2px] border-retro-dark/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-retro-sm ${
                        order.type === "35mm x 45mm Photos" ? "bg-retro-teal border-[3px] border-retro-teal"
                        : order.type === "50mm x 50mm Photos" ? "bg-retro-red border-[3px] border-retro-red"
                        : "bg-retro-mustard border-[3px] border-retro-mustard"
                      }`}>
                        <Package className="w-6 h-6 text-retro-cream" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg text-retro-dark">{order.type}</h3>
                        <p className="text-retro-dark-mid text-sm">Order #{order.id}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      order.status === "completed" ? "bg-retro-teal text-retro-cream" : "bg-retro-orange text-retro-cream"
                    }`}>
                      {order.status}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-retro-dark-mid">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Order Date</span>
                      </div>
                      <p className="text-retro-dark font-medium">{order.date}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-retro-dark-mid">
                        <Package className="w-4 h-4" />
                        <span className="text-sm">Delivery</span>
                      </div>
                      <p className="text-retro-dark font-medium">{order.delivery}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t-[2px] border-retro-dark/20">
                    <span className="text-retro-dark-mid text-sm">Total</span>
                    <span className="font-display text-xl text-retro-dark">{order.price}</span>
                  </div>
                  <div className="flex gap-3 pt-4">
                    {order.status === "completed" ? (
                      <Button variant="outline" size="sm" className="border-[2px] border-retro-teal hover:bg-retro-teal hover:text-retro-cream">
                        <CheckCircle className="w-4 h-4 mr-2" />Download
                      </Button>
                    ) : (
                      <Button variant="hero" size="sm" disabled>
                        <Clock className="w-4 h-4 mr-2" />Processing
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="border-[2px] border-retro-dark hover:bg-retro-dark hover:text-retro-cream">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="sticker bg-retro-dark rounded-xl p-8 shadow-retro-lg text-retro-cream">
                <h3 className="font-display text-xl mb-6">Account Actions</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-[2px] border-retro-cream hover:bg-retro-cream hover:text-retro-dark text-retro-cream"
                    onClick={() => navigate("/photo-capture")}>
                    <Package className="w-5 h-5 mr-2" />New Order
                  </Button>
                  <Button variant="hero" size="lg" className="hover:shadow-retro-hover" onClick={handleSignOut}>
                    <LogOut className="w-5 h-5 mr-2" />Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
