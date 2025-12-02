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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center mt-20 px-6 pb-20">
        <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
          ✨ Your Digital Assets, Organized
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Simple & Secure
          <br />
          Digital Asset Manager
        </h1>

        <p className="mt-8 text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
          Upload, organize, and manage your digital files with powerful search, 
          tagging, and folder management. Everything you need in one place.
        </p>

        <div className="flex gap-4 justify-center mt-12">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold border border-gray-200"
          >
            Sign In
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">100%</div>
            <div className="text-gray-600 mt-2">Secure Storage</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">Fast</div>
            <div className="text-gray-600 mt-2">Upload Speed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">Easy</div>
            <div className="text-gray-600 mt-2">To Organize</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Everything You Need to Manage Your Files
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Powerful features designed for efficiency and simplicity
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Upload className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Easy Upload
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Drag and drop or click to upload files. Support for multiple file types with instant processing.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
              <FolderTree className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Smart Organization
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Create folders and subfolders to organize your files exactly the way you want.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Search className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Powerful Search
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Find any file instantly with advanced search filters by name, type, and date.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Tag className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Custom Tags
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Add unlimited tags to your files for better categorization and quick access.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Secure & Private
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Your files are encrypted and protected. Only you have access to your digital assets.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Lightning Fast
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Optimized performance ensures quick uploads, downloads, and seamless browsing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Get Organized?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of users managing their digital assets efficiently
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Cancel anytime</span>
            </div>
          </div>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 mt-8 px-10 py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-bold text-lg"
          >
            Start Free Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          <p>© 2024 Digital Asset Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}