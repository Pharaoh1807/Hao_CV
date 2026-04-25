import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import { Mail, Lock, ArrowRight, Globe } from 'lucide-react';
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
    <div className="min-h-screen flex bg-background">
      {/* Visual side */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary-dark relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/30 to-transparent"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40 rotate-12">
            <Globe size={48} className="text-white" />
          </div>
          <h2 className="text-5xl font-extrabold text-white tracking-tight mb-4">CV Builder Admin</h2>
          <p className="text-slate-400 text-xl max-w-md mx-auto font-light leading-relaxed">
            Manage your professional identity and showcase your career achievements to the world.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Globe size={24} className="text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-secondary-dark">CV Admin</span>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-secondary-dark tracking-tight mb-3">Login</h1>
            <p className="text-slate-500 font-medium">Enter your credentials to access the admin panel.</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                <Mail size={16} className="text-slate-400" /> Email Address
              </label>
              <input 
                type="email" 
                {...register('email')}
                placeholder="name@company.com" 
                className={`input-field ${errors.email ? 'border-red-500 bg-red-50/30' : ''}`} 
              />
              {errors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Lock size={16} className="text-slate-400" /> Password
                </label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>
              </div>
              <input 
                type="password" 
                {...register('password')}
                placeholder="••••••••" 
                className={`input-field ${errors.password ? 'border-red-500 bg-red-50/30' : ''}`} 
              />
              {errors.password && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.password.message}</p>}
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white p-4 rounded-2xl font-bold hover:bg-primary-dark transition-all duration-300 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group mt-4"
            >
              {loading ? 'Authenticating...' : (
                <>
                  Login to Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline ml-1">Create one now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
