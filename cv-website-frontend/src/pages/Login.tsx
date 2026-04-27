import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import { Mail, Lock, ArrowRight, Globe, Loader2, Code, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  if (token) {
    return <Navigate to="/admin" />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', data);
      login(response.data.token);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f5f7fa] font-sans">
      {/* 1. Bố cục tổng thể - Cột trái (Desktop 45%) */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#1a2b3c] relative items-center justify-center p-16 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent"></div>
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-12 inline-flex items-center justify-center size-20 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-500/40 rotate-12">
            <Globe size={40} className="text-white" />
          </div>
          <h2 className="text-6xl font-black text-white tracking-tighter leading-[1.1] mb-8">
            Build your <br />
            <span className="text-blue-400">Professional</span> <br />
            Identity.
          </h2>
          <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
            Everything you need to showcase your career achievements in one place. Modern, clean, and blazingly fast.
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="size-10 rounded-full border-2 border-[#1a2b3c] bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Joined by 100+ Pros</p>
          </div>
        </div>
      </div>

      {/* 1. Bố cục tổng thể - Cột phải (Desktop 55%) */}
      <div className="w-full lg:w-[55%] flex flex-col items-center justify-center p-6 md:p-12 relative">
        
        {/* Mobile Logo View */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
           <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
             <Globe size={20} className="text-white" />
           </div>
           <span className="font-black text-xl tracking-tighter text-[#1a2b3c] uppercase">Console</span>
        </div>

        {/* 2. Card Form - Animation Slide Up */}
        <div className="w-full max-w-[480px] bg-white rounded-[24px] p-8 md:p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* 5. Logo/Title ở trên form */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Welcome back</h1>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 3. Form fields - Email */}
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#1e293b] ml-1 block">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@company.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-white border ${errors.email ? 'border-red-500 bg-red-50/30' : 'border-[#e2e8f0] focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10'} rounded-[12px] outline-none transition-all duration-200 text-slate-900 placeholder:text-[#94a3b8] font-medium text-[14px]`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1 uppercase tracking-tight">{errors.email.message}</p>}
            </div>

            {/* 3. Form fields - Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[14px] font-semibold text-[#1e293b] block">Password</label>
                <a href="#" className="text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors decoration-none">Forgot password?</a>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-white border ${errors.password ? 'border-red-500 bg-red-50/30' : 'border-[#e2e8f0] focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10'} rounded-[12px] outline-none transition-all duration-200 text-slate-900 placeholder:text-[#94a3b8] font-medium text-[14px]`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1 uppercase tracking-tight">{errors.password.message}</p>}
            </div>

            {/* 4. Button Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[54px] bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white rounded-[40px] font-bold text-[15px] uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 overflow-hidden"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* 5. Social login options */}
          <div className="mt-8 mb-8 flex items-center gap-4 text-slate-400">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">or continue with</span>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 h-[52px] border border-slate-200 rounded-[40px] hover:bg-slate-50 transition-all font-bold text-sm text-slate-700">
              <Globe size={18} className="text-red-500" /> Google
            </button>
            <button className="flex items-center justify-center gap-3 h-[52px] border border-slate-200 rounded-[40px] hover:bg-slate-50 transition-all font-bold text-sm text-slate-700">
              <Code size={18} className="text-slate-900" /> GitHub
            </button>
          </div>

          {/* 5. Link Create an account */}
          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline ml-1">Create an account</Link>
            </p>
          </div>
        </div>

        <p className="mt-12 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
          Nguyen Thanh Hao • CV Admin Console
        </p>
      </div>
    </div>
  );
}
