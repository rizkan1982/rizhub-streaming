import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

export const translations = {
  en: {
    // Navbar
    search: "Search premium content...",
    searchBtn: "Search",
    premium: "Premium Entertainment",
    
    // Homepage
    welcomeTitle: "Premium Entertainment",
    welcomeDesc: "Discover exclusive content curated just for you",
    ultraHD: "Ultra HD",
    fastStream: "Fast Stream",
    secure: "Secure",
    trending: "Trending Now",
    searchResults: "Search Results",
    
    // Watch Page
    backToGallery: "Back to Gallery",
    relatedContent: "Related Content",
    loadingVideo: "Loading Premium Content",
    extracting: "Extracting stream URL...",
    errorTitle: "Server Error 😅",
    errorMessage: "Server is having issues, please hold your excitement... Try refreshing or come back in a few minutes!",
    refreshPage: "Refresh Page",
    preparing: "Preparing Video...",
    pleasewait: "Please wait a moment",
    
    // Comments
    comments: "Comments",
    noComments: "No comments yet. Be the first!",
    shareThoughts: "Share your thoughts... (No login required)",
    postComment: "Post Comment",
    posting: "Posting...",
    reply: "Reply",
    writeReply: "Write a reply...",
    cancel: "Cancel",
    
    // Likes
    liked: "Liked",
    like: "Like",
    
    // Loading
    loading: "Loading...",
    loadingRelated: "Loading related content...",
    noRelated: "No related videos found",
    
    // Errors
    connectionError: "Connection Error",
    failedToConnect: "Failed to connect to server",
    makeBackend: "Please check your connection and try again",
    noVideos: "No Content Found",
    tryDifferent: "Try searching with different keywords",
    
    // Admin
    adminLogin: "Admin Login",
    username: "Username",
    password: "Password",
    login: "Login",
    logout: "Logout",
    dashboard: "Dashboard",
    overview: "Overview",
    users: "Users",
    analytics: "Analytics",
    totalUsers: "Total Users",
    activeNow: "Active Now",
    totalComments: "Total Comments",
    totalLikes: "Total Likes",
    
    // Pagination
    previous: "Previous",
    next: "Next",
    page: "Page",
    
    // Filters
    filters: "Filters",
    genre: "Genre",
    duration: "Duration",
    clearFilters: "Clear All Filters",
    filterTip: "💡 Tip: Combine genre + duration for better results!"
  },
  id: {
    // Navbar
    search: "Cari konten premium...",
    searchBtn: "Cari",
    premium: "Hiburan Premium",
    
    // Homepage
    welcomeTitle: "Hiburan Premium",
    welcomeDesc: "Temukan konten eksklusif yang dipilih khusus untuk Anda",
    ultraHD: "Ultra HD",
    fastStream: "Stream Cepat",
    secure: "Aman",
    trending: "Sedang Trending",
    searchResults: "Hasil Pencarian",
    
    // Watch Page
    backToGallery: "Kembali ke Galeri",
    relatedContent: "Konten Terkait",
    loadingVideo: "Memuat Konten Premium",
    extracting: "Mengekstrak URL stream...",
    errorTitle: "Lagi Error Om 😅",
    errorMessage: "Server lagi gangguan nih, tahan dulu ya sange nya... Coba refresh atau balik beberapa menit lagi!",
    refreshPage: "Refresh Halaman",
    preparing: "Menyiapkan Video...",
    pleasewait: "Mohon tunggu sebentar",
    
    // Comments
    comments: "Komentar",
    noComments: "Belum ada komentar. Jadilah yang pertama!",
    shareThoughts: "Bagikan pikiran Anda... (Tanpa login)",
    postComment: "Kirim Komentar",
    posting: "Mengirim...",
    reply: "Balas",
    writeReply: "Tulis balasan...",
    cancel: "Batal",
    
    // Likes
    liked: "Disukai",
    like: "Suka",
    
    // Loading
    loading: "Memuat...",
    loadingRelated: "Memuat konten terkait...",
    noRelated: "Tidak ada video terkait",
    
    // Errors
    connectionError: "Kesalahan Koneksi",
    failedToConnect: "Gagal terhubung ke server",
    makeBackend: "Periksa koneksi Anda dan coba lagi",
    noVideos: "Konten Tidak Ditemukan",
    tryDifferent: "Coba cari dengan kata kunci berbeda",
    
    // Admin
    adminLogin: "Login Admin",
    username: "Nama Pengguna",
    password: "Kata Sandi",
    login: "Masuk",
    logout: "Keluar",
    dashboard: "Dashboard",
    overview: "Ringkasan",
    users: "Pengguna",
    analytics: "Analitik",
    totalUsers: "Total Pengguna",
    activeNow: "Aktif Sekarang",
    totalComments: "Total Komentar",
    totalLikes: "Total Suka",
    
    // Pagination
    previous: "Sebelumnya",
    next: "Selanjutnya",
    page: "Halaman",
    
    // Filters
    filters: "Filter",
    genre: "Genre",
    duration: "Durasi",
    clearFilters: "Hapus Semua Filter",
    filterTip: "💡 Tips: Gabungkan genre + durasi untuk hasil lebih baik!"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("rizhub-language") || "id";
  });

  useEffect(() => {
    localStorage.setItem("rizhub-language", language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "id" : "en");
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

