import { Shield, ArrowRight, Zap, BarChart3, Users, Image, FileText, Activity, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-7 h-7 text-indigo-400" />
              <span className="text-lg font-bold">SafeGuard AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">Sign In</Link>
              <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-900 to-cyan-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Industrial Safety,{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Reimagined with AI
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Digitize safety incident management with AI-powered analysis, real-time tracking, and actionable insights for manufacturing and chemical industries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="px-8 py-3 bg-indigo-600 text-white rounded-lg text-base font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="px-8 py-3 bg-slate-800 text-white rounded-lg text-base font-semibold hover:bg-slate-700 transition-colors border border-slate-700">
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: '500+', label: 'Incidents Tracked' },
              { value: '98%', label: 'Resolution Rate' },
              { value: '3x', label: 'Faster Response' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'AI-Powered Analysis', description: 'Gemini AI analyzes every incident for severity, root causes, and preventive measures automatically.' },
              { icon: Activity, title: 'Real-time Tracking', description: 'Track incident lifecycle from report to resolution with status updates and notifications.' },
              { icon: Users, title: 'Role-Based Access', description: 'Dedicated dashboards and permissions for employees, managers, and administrators.' },
              { icon: Image, title: 'Image Evidence Upload', description: 'Capture and upload incident photos as evidence directly through the platform.' },
              { icon: BarChart3, title: 'Analytics Dashboard', description: 'Comprehensive charts and metrics for safety trends, department performance, and risk analysis.' },
              { icon: FileText, title: 'PDF Reports', description: 'Generate professional monthly safety reports, department analyses, and high-risk reports.' },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
                <feature.icon className="w-10 h-10 text-indigo-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Report', description: 'Employee reports an incident with details, photos, and location.' },
              { step: '02', title: 'Analyze', description: 'AI instantly analyzes severity, root causes, and recommends actions.' },
              { step: '03', title: 'Resolve', description: 'Manager assigns, investigates, and resolves with full audit trail.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold mx-auto mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Try Demo Accounts</h2>
          <p className="text-slate-400 text-center mb-10 max-w-xl mx-auto">Click a role to auto-fill credentials on the login page</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { role: 'Employee', email: 'employee@safeguard.com', desc: 'Report and track incidents', color: 'blue' },
              { role: 'Manager', email: 'manager@safeguard.com', desc: 'Manage and analyze incidents', color: 'purple' },
              { role: 'Admin', email: 'admin@safeguard.com', desc: 'Full system administration', color: 'amber' },
            ].map((demo) => (
              <Link key={demo.role} to={`/login?role=${demo.role.toLowerCase()}`} className="p-6 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 text-center">
                <h3 className="text-xl font-bold mb-2">{demo.role}</h3>
                <p className="text-sm text-slate-400 mb-3">{demo.desc}</p>
                <p className="text-xs text-slate-500 font-mono">{demo.email}</p>
                <p className="text-xs text-slate-500 font-mono">demo1234</p>
                <div className="mt-4 flex items-center justify-center text-indigo-400 text-sm font-medium gap-1">
                  Login as {demo.role} <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-semibold">SafeGuard AI</span>
          </div>
          <p className="text-xs text-slate-500">AI-Powered Safety Incident Management System</p>
        </div>
      </footer>
    </div>
  );
}
