// src/components/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { User, Package, Clock, CheckCircle, LogOut, ImageOff, ChevronDown, ChevronUp, MapPin, Hash, Calendar, Printer, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  photo_type: string;
  variation_id: number;
  image_data: string;
  filename: string;
  wants_print: boolean;
  delivery_address: string | null;
  status: "completed" | "processing" | "failed";
  created_at: string;
}

const TYPE_COLORS: Record<number, string> = {
  0: "bg-retro-teal border-[3px] border-retro-teal",
  1: "bg-retro-red border-[3px] border-retro-red",
  2: "bg-retro-mustard border-[3px] border-retro-mustard",
};

export const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[ProfilePage] Failed to fetch orders:", error);
      } else {
        setOrders((data as Order[]) ?? []);
      }
      setLoadingOrders(false);
    };

    fetchOrders();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleDownload = (order: Order) => {
    try {
      const dataUrl = `data:image/jpeg;base64,${order.image_data}`;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = order.filename || "photo.jpg";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 100);
    } catch (err) {
      console.error("[ProfilePage] Download failed:", err);
    }
  };

  // Display name: prefer full_name from metadata, fallback to email prefix
  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <div className="min-h-screen grain-overlay bg-retro-cream/50">
      <Navigation isLandingPage={false} />
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-retro-red border-[3px] border-retro-dark rounded-lg px-4 py-1.5 shadow-retro-sm mb-6">
              <User className="w-4 h-4 text-retro-cream" />
              <span className="font-display text-sm tracking-wider text-retro-cream">{t('profile.createBadge')}</span>
            </div>
            <h1 className="font-display text-[3rem] md:text-[4.5rem] text-retro-dark leading-[0.9] mb-6 tracking-tight">
              {t('profile.welcome')}
              <br />
              <span className="font-display-serif italic text-retro-red text-[2rem] md:text-[3rem]">
                {displayName}
              </span>
            </h1>
            <p className="text-retro-dark-mid text-lg max-w-2xl mx-auto font-medium mb-2">
              {user?.email}
            </p>
            <p className="text-retro-dark-mid text-base max-w-2xl mx-auto font-medium mb-12">
              {t('profile.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Orders list */}
            {loadingOrders ? (
              <div className="text-center py-12 text-retro-dark-mid font-medium">
                Loading orders…
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-retro-dark-mid font-medium">
                No orders yet. Create your first photo!
              </div>
            ) : (
              <div className="grid gap-6">
                {orders.map((order, idx) => {
                  const colorClass = TYPE_COLORS[idx % 3];
                  const createdAt = new Date(order.created_at);
                  const dateStr = createdAt.toLocaleDateString();
                  const timeStr = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const delivery = order.wants_print ? "Print + Digital" : "Digital Download";
                  const price = order.wants_print ? "$9.99" : "Free";
                  const thumbSrc = order.image_data
                    ? `data:image/jpeg;base64,${order.image_data}`
                    : null;
                  const isExpanded = expandedOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="sticker bg-retro-cream rounded-xl shadow-retro-lg border-[2px] border-retro-dark/20 overflow-hidden"
                    >
                      {/* Card header — always visible */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-retro-sm overflow-hidden flex-shrink-0 ${colorClass}`}>
                              {thumbSrc ? (
                                <img src={thumbSrc} alt={order.filename} className="w-full h-full object-cover" />
                              ) : (
                                <ImageOff className="w-6 h-6 text-retro-cream" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-display text-lg text-retro-dark">{order.photo_type}</h3>
                              <p className="text-retro-dark-mid text-sm">{t('profile.orderNumber')} {order.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                              order.status === "completed"
                                ? "bg-retro-teal text-retro-cream"
                                : order.status === "processing"
                                ? "bg-retro-orange text-retro-cream"
                                : "bg-retro-red text-retro-cream"
                            }`}
                          >
                            {order.status}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-retro-dark-mid">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{t('profile.orderDate')}</span>
                            </div>
                            <p className="text-retro-dark font-medium">{dateStr}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-retro-dark-mid">
                              <Package className="w-4 h-4" />
                              <span className="text-sm">{t('profile.delivery')}</span>
                            </div>
                            <p className="text-retro-dark font-medium">{delivery}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t-[2px] border-retro-dark/20">
                          <span className="text-retro-dark-mid text-sm">{t('profile.total')}</span>
                          <span className="font-display text-xl text-retro-dark">{price}</span>
                        </div>

                        <div className="flex gap-3 pt-4">
                          {order.status === "completed" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[2px] border-retro-teal hover:bg-retro-teal hover:text-retro-cream"
                              onClick={() => handleDownload(order)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {t('profile.download')}
                            </Button>
                          ) : (
                            <Button variant="hero" size="sm" disabled>
                              <Clock className="w-4 h-4 mr-2" />
                              {t('profile.processing')}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[2px] border-retro-dark hover:bg-retro-dark hover:text-retro-cream"
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                          >
                            {isExpanded ? (
                              <><ChevronUp className="w-4 h-4 mr-2" />Hide Details</>
                            ) : (
                              <><ChevronDown className="w-4 h-4 mr-2" />{t('profile.viewDetails')}</>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Expanded details panel */}
                      {isExpanded && (
                        <div className="border-t-[2px] border-retro-dark/20 bg-retro-dark/5 p-6 animate-fade-in">
                          <h4 className="font-display text-base text-retro-dark mb-4 uppercase tracking-wider">Order Details</h4>

                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Left column — metadata */}
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <Hash className="w-4 h-4 text-retro-dark-mid mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-retro-dark-mid uppercase tracking-wider mb-0.5">Order ID</p>
                                  <p className="text-retro-dark font-mono text-sm break-all">{order.id}</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-retro-dark-mid mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-retro-dark-mid uppercase tracking-wider mb-0.5">Date & Time</p>
                                  <p className="text-retro-dark font-medium">{dateStr} at {timeStr}</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <Package className="w-4 h-4 text-retro-dark-mid mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-retro-dark-mid uppercase tracking-wider mb-0.5">Photo Type</p>
                                  <p className="text-retro-dark font-medium">{order.photo_type}</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                {order.wants_print ? (
                                  <Printer className="w-4 h-4 text-retro-dark-mid mt-0.5 flex-shrink-0" />
                                ) : (
                                  <Download className="w-4 h-4 text-retro-dark-mid mt-0.5 flex-shrink-0" />
                                )}
                                <div>
                                  <p className="text-xs text-retro-dark-mid uppercase tracking-wider mb-0.5">Delivery Method</p>
                                  <p className="text-retro-dark font-medium">{delivery}</p>
                                </div>
                              </div>

                              {order.wants_print && order.delivery_address && (
                                <div className="flex items-start gap-3">
                                  <MapPin className="w-4 h-4 text-retro-dark-mid mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-retro-dark-mid uppercase tracking-wider mb-0.5">Delivery Address</p>
                                    <p className="text-retro-dark font-medium">{order.delivery_address}</p>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-start gap-3">
                                <CheckCircle className="w-4 h-4 text-retro-dark-mid mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-retro-dark-mid uppercase tracking-wider mb-0.5">Total Paid</p>
                                  <p className="text-retro-dark font-display text-lg">{price}</p>
                                </div>
                              </div>
                            </div>

                            {/* Right column — full image */}
                            <div>
                              <p className="text-xs text-retro-dark-mid uppercase tracking-wider mb-3">Your Photo</p>
                              {thumbSrc ? (
                                <div className="relative rounded-xl overflow-hidden border-[2px] border-retro-dark/20 max-w-[200px]">
                                  <img
                                    src={thumbSrc}
                                    alt={order.filename}
                                    className="w-full h-auto object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-full aspect-[3/4] max-w-[200px] rounded-xl bg-retro-dark/10 flex items-center justify-center">
                                  <ImageOff className="w-8 h-8 text-retro-dark-mid" />
                                </div>
                              )}
                              <p className="text-xs text-retro-dark-mid mt-2">{order.filename}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-12 text-center">
              <div className="sticker bg-retro-inverse rounded-xl p-8 shadow-retro-lg">
                <h3 className="font-display text-xl mb-6">{t('profile.accountActions')}</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-[2px] border-retro-dark hover:bg-retro-dark hover:text-retro-cream"
                    onClick={() => navigate("/photo-capture")}
                  >
                    <Package className="w-5 h-5 mr-2" />
                    {t('profile.newOrder')}
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    className="hover:shadow-retro-hover"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    {t('profile.signOut')}
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