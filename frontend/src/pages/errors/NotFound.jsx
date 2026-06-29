import { Link } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield className="w-8 h-8 text-indigo-500" />
          <span className="text-xl font-bold text-slate-900">SafeGuard AI</span>
        </div>
        <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
        <p className="text-lg text-slate-500 mb-6">Page not found</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Home className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
