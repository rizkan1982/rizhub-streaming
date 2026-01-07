import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3000";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    
    fetchDashboard();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    const token = localStorage.getItem("adminToken");
    
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setDashboard(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading-rizhub w-24 h-24 mx-auto mb-6 rounded-3xl"></div>
          <p className="text-white/40">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L3 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V7.89l7-3.78v8.88z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-gradient-rizhub">RizHub Admin</h1>
                <p className="text-xs text-white/40">Real-time Analytics Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchDashboard}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm transition-colors"
              >
                🔄 Refresh
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 text-sm transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "📊 Overview", icon: "📊" },
            { id: "users", label: "👥 Users", icon: "👥" },
            { id: "watching", label: "👁️ Currently Watching", icon: "👁️" },
            { id: "comments", label: "💬 Comments", icon: "💬" },
            { id: "analytics", label: "📈 Analytics", icon: "📈" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-lg"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && dashboard && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Users"
                value={dashboard.overview.totalUsers}
                icon="👥"
                gradient="from-purple-600 to-purple-900"
              />
              <StatCard 
                title="Active Now"
                value={dashboard.overview.activeUsers}
                icon="✨"
                gradient="from-pink-600 to-pink-900"
              />
              <StatCard 
                title="Total Comments"
                value={dashboard.overview.totalComments}
                icon="💬"
                gradient="from-red-600 to-red-900"
              />
              <StatCard 
                title="Total Likes"
                value={dashboard.overview.totalLikes}
                icon="❤️"
                gradient="from-cyan-600 to-cyan-900"
              />
            </div>

            {/* Most Watched Videos */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <h2 className="text-2xl font-black text-gradient-rizhub mb-6">🔥 Most Watched (24h)</h2>
              <div className="space-y-3">
                {dashboard.mostWatched?.slice(0, 10).map((video, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                      #{i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold line-clamp-1">{video.title}</p>
                      <p className="text-xs text-white/40">{video.platform}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gradient-rizhub">{video.views}</p>
                      <p className="text-xs text-white/40">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Currently Watching Tab */}
        {activeTab === "watching" && dashboard && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gradient-rizhub">👁️ Currently Watching</h2>
              <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm font-bold">
                {dashboard.currentlyWatching?.length || 0} Active
              </span>
            </div>
            
            <div className="space-y-3">
              {dashboard.currentlyWatching?.map((user, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        {user.username?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{user.username}</p>
                        <p className="text-xs text-white/40">
                          Active {Math.round((Date.now() - new Date(user.lastActive).getTime()) / 1000 / 60)} min ago
                        </p>
                      </div>
                    </div>
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                  {user.watchHistory && user.watchHistory[0] && (
                    <p className="text-sm text-white/60 ml-13">
                      Watching: <span className="text-white/80">{user.watchHistory[0].videoTitle}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && dashboard && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <h2 className="text-2xl font-black text-gradient-rizhub mb-6">📈 Hourly Statistics (24h)</h2>
              <div className="space-y-4">
                {dashboard.hourlyStats?.slice(-24).reverse().map((stat, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-semibold">
                        {new Date(stat.hour).toLocaleString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-purple-400">👥 {stat.visitors.total}</span>
                        <span className="text-pink-400">👁️ {stat.videos.totalViews}</span>
                        <span className="text-red-400">💬 {stat.interactions.comments}</span>
                        <span className="text-cyan-400">❤️ {stat.interactions.likes}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600"
                        style={{ width: `${Math.min((stat.visitors.total / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 border border-white/10 shadow-xl`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-4xl">{icon}</span>
        <div className="text-right">
          <p className="text-3xl font-black text-white">{value?.toLocaleString() || 0}</p>
        </div>
      </div>
      <p className="text-white/80 font-semibold">{title}</p>
    </div>
  );
}

