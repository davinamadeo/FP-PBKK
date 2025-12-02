import Navbar from "@/app/components/navbar";
import Link from "next/link";
import { 
  Upload, 
  FolderTree, 
  Shield, 
  Zap, 
  Search, 
  Tag,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* LAYER 1 — Main Blue-White Gradient */}
      <div className="absolute inset-0 -z-50 bg-gradient-to-br 
                      from-[#f5f9ff] via-[#dceaff] to-[#b7d4ff]"></div>

      {/* LAYER 2 — Blue Radial Glow (Top Left) */}
      <div className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px]
                      bg-[radial-gradient(circle,_rgba(173,202,255,0.55),_rgba(173,202,255,0)_60%)]
                      blur-[40px] -z-40"></div>

      {/* LAYER 3 — White Highlight (Center) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.85),_rgba(255,255,255,0)_70%)]
                      -z-30"></div>

      {/* LAYER 4 — Soft Wave Shape */}
      <div className="absolute inset-0 -z-20 pointer-events-none opacity-70">
        <svg width="100%" height="100%" viewBox="0 0 1440 700" preserveAspectRatio="none">
          <path
            d="M0,220 C280,360 540,130 830,230 C1080,310 1250,150 1440,240 L1440,700 L0,700 Z"
            fill="white"
            opacity="0.45"
          />
        </svg>
      </div>

      {/* LAYER 5 — Soft White Mist */}
      <div className="absolute inset-0 bg-white/15 backdrop-blur-[25px] -z-10"></div>

      <Navbar />   

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6">
        
        {/* Glow */}
        <div className="absolute inset-0 -z-10 flex justify-center">
          <div className="w-[700px] h-[700px] bg-blue-400/20 blur-[180px] rounded-full opacity-60"></div>
        </div>

        <div className="inline-block mb-6 px-6 py-3 bg-blue-100 text-blue-700 rounded-full text-sm font-medium shadow-sm border border-blue-200">
          ✨ The Modern Way To Manage Digital Files
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
          One Platform.
          <br />
          Total File Control.
        </h1>

        <p className="mt-10 text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
          Say goodbye to cluttered folders and confusing file structures. Our system gives you
          a clean, intuitive, and powerful workspace to store, organize, search, and secure 
          your entire digital world effortlessly.
        </p>

        <div className="flex gap-4 justify-center mt-12">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white hover:bg-gray-100 text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold border border-gray-200"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="h-screen flex flex-col justify-center px-6">
        <div className="max-w-6xl mx-auto text-center mb-20">

          {/* Section Label */}
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full text-sm font-semibold 
                          bg-blue-100 text-blue-700 shadow-sm border border-blue-200">
            About Us
          </span>

          <h2 className="text-5xl font-bold text-gray-900 tracking-tight">
            Built for Teams. Loved by Everyone.
          </h2>

          <p className="mt-5 text-gray-600 text-xl max-w-4xl mx-auto leading-relaxed">
            From individuals to enterprise-level collaborators, Digital Asset Manager 
            gives you clarity and speed by eliminating digital chaos.  
            Smart organization, powerful automation, and beautiful design, all in one place.
          </p>
        </div>

        {/* Improved Card Layout (2/1 layout for visual hierarchy) */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

          {/* Card 1 */}
          <div className="group p-10 bg-white rounded-3xl shadow-xl border border-gray-100 
                          hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 
                          relative overflow-hidden min-h-[300px]">
            
            {/* Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl"></div>

            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              To transform how people interact with digital assets.  
              No more clutter, no more overthinking — just a clean, intelligent, 
              and intuitive workspace for everything you own.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group p-10 bg-white rounded-3xl shadow-xl border border-gray-100 
                          hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 
                          relative overflow-hidden min-h-[300px]">
            
            <div className="absolute -top-12 left-0 w-28 h-28 bg-indigo-300/20 rounded-full blur-2xl"></div>

            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
              <FolderTree className="w-8 h-8 text-indigo-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900">Why It Matters</h3>
            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              Your digital world grows every day.  
              We make it effortless to stay organized, save time, reduce stress, 
              and keep every file exactly where it should be — instantly accessible.
            </p>
          </div>

          {/* Card 3 (highlight card) */}
          <div className="group p-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white 
                          rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 
                          transition-all duration-300 relative overflow-hidden min-h-[300px]">
            
            {/* Glow */}
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>

            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-bold">Future Vision</h3>
            <p className="mt-4 text-white/90 text-lg leading-relaxed">
              AI-powered automation, instant global search, predictive tagging,  
              collaboration tools, versioning, and faster-than-ever performance.  
              The future of digital asset management starts here.
            </p>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="h-screen flex flex-col justify-center px-6">
        <div className="text-center mb-14">

          <span className="inline-block px-4 py-1.5 mb-3 rounded-full text-sm font-semibold 
                          bg-purple-100 text-purple-700 shadow-sm border border-purple-200">
            Powerful Features
          </span>

          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Everything You Need To Stay Organized
          </h2>
          <p className="mt-3 text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Beautiful tools, blazing speed, and thoughtful design — all crafted to help you manage everything effortlessly.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

          {[
            {
              icon: Upload,
              title: "Effortless Upload",
              desc: "Drag, drop, and instantly import any file.",
              glow: "from-blue-300/40 to-blue-100/20",
            },
            {
              icon: FolderTree,
              title: "Smart Organization",
              desc: "Sort, group, and structure your files easily.",
              glow: "from-violet-300/40 to-violet-100/20",
            },
            {
              icon: Search,
              title: "Lightning Search",
              desc: "Find files instantly with advanced indexing.",
              glow: "from-rose-300/40 to-rose-100/20",
            },
            {
              icon: Tag,
              title: "Unlimited Tags",
              desc: "Categorize files with custom labels.",
              glow: "from-green-300/40 to-green-100/20",
            },
            {
              icon: Shield,
              title: "Bank-Level Security",
              desc: "Encrypted storage keeps your files safe.",
              glow: "from-yellow-300/40 to-yellow-100/20",
            },
            {
              icon: Zap,
              title: "Optimized Speed",
              desc: "Lightning-fast navigation and interaction.",
              glow: "from-orange-300/40 to-orange-100/20",
            },
          ].map((f, i) => (
            <div 
              key={i}
              className="relative group bg-white rounded-2xl p-6 border border-gray-200 shadow-lg 
                        hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden min-h-[200px]"
            >

              {/* Smaller Glow */}
              <div
                className={`absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br ${f.glow} 
                            blur-2xl rounded-full opacity-30 group-hover:opacity-40 transition-opacity`}
              ></div>

              {/* Smaller Icon */}
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                <f.icon className="w-6 h-6 text-blue-600" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{f.title}</h3>

              {/* Smaller Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="h-screen flex flex-col justify-center px-6 relative">

        {/* Large ambient glow background */}
        <div className="absolute inset-0 -z-10 flex justify-center">
          <div className="w-[900px] h-[900px] bg-blue-500/20 blur-[200px] rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative 
                        bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 
                        text-white p-16 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)]
                        overflow-hidden backdrop-blur-xl border border-white/20">

          {/* Moving spotlight overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent 
                          opacity-40 animate-spotlight pointer-events-none"></div>

          {/* Decorative corner glows */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 blur-2xl rounded-full"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-300/20 blur-3xl rounded-full"></div>

          <h2 className="text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
            Take Control of Your Digital Life.
          </h2>

          <p className="text-xl mb-12 text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Organize better. Find faster. Work smarter.<br />
            No credit card required, built for everyone.
          </p>

          <div className="flex justify-center mb-10">
            <span className="w-20 h-px bg-white/40 rounded-full"></span>
          </div>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-14 py-4 
                      bg-white text-blue-700 rounded-2xl font-semibold text-lg
                      shadow-xl hover:shadow-2xl transition-all
                      hover:-translate-y-1 active:scale-95
                      border border-white/60"
          >
            Start Free Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="w-full bg-white/80 backdrop-blur-xl border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center text-gray-600">

          {/* Divider */}
          <div className="mb-6 flex justify-center">
            <span className="w-16 h-px bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></span>
          </div>

          {/* Main Text */}
          <p className="text-sm md:text-base leading-relaxed">
            &copy; {new Date().getFullYear()} <span className="font-semibold">Digital Asset Manager</span>. 
            All rights reserved.
          </p>

          <p className="mt-2 text-xs md:text-sm text-gray-500">
            Final Project Pemrograman Berbasis Kerangka Kerja<br />
            <span className="font-medium text-gray-700">Davin Amadeo Wijaya (5025231204)</span>
          </p>

        </div>
      </footer>
    </div>
  );
}
