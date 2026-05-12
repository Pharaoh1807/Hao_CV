import { useState, useEffect, forwardRef, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cropper from 'react-easy-crop';
import {
  Save, LogOut, Plus, Trash2, User, Briefcase, GraduationCap, Award,
  Code, Globe, ChevronLeft, Camera, Mail, Phone, MapPin,
  Link as LinkIcon, Check, Loader2, Sparkles, Sun, Moon, X, Crop,
  Calendar, Heart
} from 'lucide-react';
import api, { BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) {
    if (url.includes('localhost:5001')) {
      return url.replace(/https?:\/\/localhost:5001/, BASE_URL);
    }
    return url;
  }
  return `${BASE_URL}${url}`;
};

// --- Premium UI Components ---

const FormLabel = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-2 ml-1 uppercase tracking-tight">
    {Icon && <Icon size={14} className="text-primary" />} {children}
  </label>
);

const FormInput = forwardRef<HTMLInputElement, any>((props, ref) => (
  <input ref={ref} {...props} className="input-field" />
));

const FormTextarea = forwardRef<HTMLTextAreaElement, any>((props, ref) => (
  <textarea ref={ref} {...props} className="input-field min-h-[120px] leading-relaxed resize-none" />
));

interface CVData {
  fullName: string;
  jobTitle: string;
  introduction: string;
  avatar: string;
  birthday?: string;
  gender?: string;
  interests?: string; // Sẽ nhập dạng "Nấu ăn, Đọc sách"
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    twitter: string;
  };
  education: { school: string; major: string; startDate: string; endDate: string; }[];
  experience: { company: string; position: string; startDate: string; endDate: string; description: string; }[];
  certificates: { name: string; category: string; year: string; }[];
  skills: { name: string; level: string; }[];
}

export default function Admin() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  // Crop State
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const { register, control, handleSubmit, reset, watch, formState: { isDirty } } = useForm<CVData>({
    defaultValues: {
      fullName: '', jobTitle: '', introduction: '', avatar: '', birthday: '', gender: '', interests: '',
      contact: { email: '', phone: '', location: '', linkedin: '', github: '', twitter: '' },
      education: [], experience: [], certificates: [], skills: []
    }
  });

  const avatarUrl = watch('avatar');

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'education' });
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experience' });
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: 'certificates' });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: 'skills' });

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const res = await api.get('/cv');
        if (res.data) reset(res.data);
      } catch (error: any) {
        if (error.response?.status !== 404) toast.error('Failed to load CV data');
      } finally {
        setLoading(false);
      }
    };
    fetchCV();
  }, [reset]);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageToCrop(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropAndUpload = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const image = new Image();
      image.src = imageToCrop;
      await new Promise((resolve) => (image.onload = resolve));
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      ctx.drawImage(image, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, croppedAreaPixels.width, croppedAreaPixels.height);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const formData = new FormData();
        formData.append('image', blob, 'avatar.jpg');
        const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        reset({ ...watch(), avatar: res.data.url });
        setImageToCrop(null);
        toast.success('Avatar updated!');
      }, 'image/jpeg');
    } catch (error) {
      toast.error('Crop failed');
    } finally { setUploading(false); }
  };

  const onSubmit = async (data: CVData) => {
    try {
      setSaving(true);
      await api.put('/cv', data);
      setSaveSuccess(true);
      toast.success('Profile updated successfully!');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-dark"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  const navItems = [
    { id: 'personal', label: 'Basic Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'certificates', label: 'Certificates', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-brand-dark flex flex-col md:flex-row transition-colors duration-500 font-sans">

      {/* Sidebar */}
      <aside className="w-full md:w-72 border-r border-slate-200 dark:border-brand-border shrink-0 md:sticky md:top-0 md:h-screen p-8 flex flex-col bg-white dark:bg-brand-dark z-20">
        <div className="mb-12 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="size-11 bg-[#1a2b3c] rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"><Sparkles size={24} className="text-white" /></div>
            <span className="font-black text-2xl tracking-tighter dark:text-white uppercase">My CV</span>
          </div>
          <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-slate-50 dark:bg-brand-card border border-slate-200 dark:border-brand-border text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === item.id ? 'bg-slate-100 dark:bg-brand-card text-primary shadow-sm border border-slate-200/50 dark:border-brand-border scale-[1.02]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-brand-card/50'}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-100 dark:border-brand-border space-y-3">
          <Link to="/home" className="flex items-center gap-3 px-5 py-3 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all group text-sm font-bold"><ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Site</Link>
          <button onClick={() => { logout(); navigate('/home'); }} className="w-full flex items-center gap-3 px-5 py-4 text-red-500/80 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all font-bold text-sm"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto">
        <header className="max-w-5xl mx-auto mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 uppercase">{navItems.find(i => i.id === activeTab)?.label}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">PRECISION EDITING MODE</p>
          </div>
          <button onClick={handleSubmit(onSubmit)} disabled={saving} className={`group relative min-w-[180px] h-14 flex items-center justify-center gap-3 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95 disabled:opacity-70 overflow-hidden btn-primary-gradient ${saveSuccess ? 'from-green-500 to-emerald-600' : ''}`}>
            {saving ? <Loader2 className="animate-spin" size={20} /> : saveSuccess ? <><Check size={20} /> <span>Done!</span></> : <>{isDirty && <span className="size-2 bg-white rounded-full animate-pulse mr-1" />}<Save size={20} /> <span>Save Changes</span></>}
          </button>
        </header>

        <div className="max-w-5xl mx-auto">
          <form className="space-y-16" onSubmit={handleSubmit(onSubmit)}>
            {activeTab === 'personal' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                  <div className="lg:col-span-4 flex flex-col items-center">
                    <div className="group relative">
                      <div onClick={() => document.getElementById('avatar-input')?.click()} className="size-44 lg:size-52 rounded-[3.5rem] p-1.5 bg-[#1a2b3c] shadow-2xl transition-all duration-700 hover:scale-105 cursor-pointer">
                        <div className="w-full h-full rounded-[3.25rem] bg-white dark:bg-brand-card overflow-hidden relative border-[6px] border-white dark:border-brand-card">
                          {uploading ? <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800"><Loader2 className="animate-spin text-primary" size={32} /></div> : avatarUrl ? <img src={getImageUrl(avatarUrl)} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 dark:text-slate-700"><User size={64} /></div>}
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"><Camera size={32} className="text-white mb-2" /><span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Change Photo</span></div>
                        </div>
                      </div>
                      <input id="avatar-input" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2"><FormLabel icon={User}>Full Name</FormLabel><FormInput {...register('fullName')} /></div>
                      <div className="space-y-2"><FormLabel icon={Briefcase}>Job Title</FormLabel><FormInput {...register('jobTitle')} /></div>
                      <div className="space-y-2"><FormLabel icon={Calendar}>Birthday</FormLabel><FormInput {...register('birthday')} placeholder="e.g. 24/08/1997" /></div>
                      <div className="space-y-2"><FormLabel icon={User}>Gender</FormLabel><FormInput {...register('gender')} placeholder="e.g. Nam / Male" /></div>
                    </div>
                    <div className="space-y-2"><FormLabel icon={Sparkles}>Career Objective / Introduction</FormLabel><FormTextarea {...register('introduction')} /></div>
                    <div className="space-y-2"><FormLabel icon={Heart}>Interests (comma separated)</FormLabel><FormInput {...register('interests')} placeholder="e.g. Đọc sách, Nấu ăn, Coding" /></div>
                  </div>
                </div>

                <section className="card-premium p-10 lg:p-14">
                  <h2 className="text-2xl font-black dark:text-white mb-10 flex items-center gap-4"><Globe size={24} className="text-[#1a2b3c]" /> <span className="uppercase tracking-tighter">Contact Information</span></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[{ label: 'Email', key: 'contact.email', icon: Mail }, { label: 'Phone', key: 'contact.phone', icon: Phone }, { label: 'Location', key: 'contact.location', icon: MapPin }, { label: 'LinkedIn URL', key: 'contact.linkedin', icon: LinkIcon }].map((item) => (
                      <div key={item.key} className="space-y-3"><FormLabel icon={item.icon}>{item.label}</FormLabel><FormInput {...register(item.key as any)} /></div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-end"><h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Work Experience</h2><button type="button" onClick={() => appendExp({ company: '', position: '', startDate: '', endDate: '', description: '' })} className="flex items-center gap-2 bg-[#1a2b3c]/10 text-[#1a2b3c] px-6 py-3 rounded-2xl font-black hover:bg-[#1a2b3c] hover:text-white transition-all text-xs uppercase tracking-widest"><Plus size={18} /> Add Role</button></div>
                <div className="space-y-10">{expFields.map((field, index) => (
                  <div key={field.id} className="card-premium p-10 group relative border-l-8 border-l-[#1a2b3c]">
                    <button type="button" onClick={() => removeExp(index)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors p-2"><Trash2 size={24} /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-2"><FormLabel icon={Briefcase}>Company Name</FormLabel><FormInput {...register(`experience.${index}.company`)} /></div>
                      <div className="space-y-2"><FormLabel icon={User}>Job Title / Role</FormLabel><FormInput {...register(`experience.${index}.position`)} /></div>
                      <div className="space-y-2"><FormLabel>Start Period</FormLabel><FormInput {...register(`experience.${index}.startDate`)} /></div>
                      <div className="space-y-2"><FormLabel>End Period</FormLabel><FormInput {...register(`experience.${index}.endDate`)} /></div>
                    </div>
                    <div className="space-y-2"><FormLabel>Key Responsibilities (Use periods to separate bullets)</FormLabel><FormTextarea {...register(`experience.${index}.description`)} rows={4} /></div>
                  </div>
                ))}</div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-end"><h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Education History</h2><button type="button" onClick={() => appendEdu({ school: '', major: '', startDate: '', endDate: '' })} className="flex items-center gap-2 bg-[#1a2b3c]/10 text-[#1a2b3c] px-6 py-3 rounded-2xl font-black hover:bg-[#1a2b3c] hover:text-white transition-all text-xs uppercase tracking-widest"><Plus size={18} /> Add School</button></div>
                <div className="space-y-10">{eduFields.map((field, index) => (
                  <div key={field.id} className="card-premium p-10 group relative border-l-8 border-l-[#1a2b3c]">
                    <button type="button" onClick={() => removeEdu(index)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors p-2"><Trash2 size={24} /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-2"><FormLabel icon={GraduationCap}>School Name</FormLabel><FormInput {...register(`education.${index}.school`)} /></div>
                      <div className="space-y-2"><FormLabel icon={Award}>Major / Degree</FormLabel><FormInput {...register(`education.${index}.major`)} /></div>
                      <div className="space-y-2"><FormLabel>Start Year</FormLabel><FormInput {...register(`education.${index}.startDate`)} /></div>
                      <div className="space-y-2"><FormLabel>End Year</FormLabel><FormInput {...register(`education.${index}.endDate`)} /></div>
                    </div>
                  </div>
                ))}</div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-end"><h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Core Skills</h2><button type="button" onClick={() => appendSkill({ name: '', level: '80%' })} className="flex items-center gap-2 bg-[#1a2b3c]/10 text-[#1a2b3c] px-6 py-3 rounded-2xl font-black hover:bg-[#1a2b3c] hover:text-white transition-all text-xs uppercase tracking-widest"><Plus size={18} /> Add Skill</button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{skillFields.map((field, index) => (
                  <div key={field.id} className="card-premium p-8 flex items-center gap-4">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2"><FormLabel icon={Code}>Skill Name</FormLabel><FormInput {...register(`skills.${index}.name`)} /></div>
                      <div className="space-y-2"><FormLabel>Level Percentage (e.g. 90%)</FormLabel><FormInput {...register(`skills.${index}.level`)} /></div>
                    </div>
                    <button type="button" onClick={() => removeSkill(index)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                  </div>
                ))}</div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-end"><h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Certificates & Awards</h2><button type="button" onClick={() => appendCert({ name: '', category: '', year: '' })} className="flex items-center gap-2 bg-[#1a2b3c]/10 text-[#1a2b3c] px-6 py-3 rounded-2xl font-black hover:bg-[#1a2b3c] hover:text-white transition-all text-xs uppercase tracking-widest"><Plus size={18} /> Add Award</button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{certFields.map((field, index) => (
                  <div key={field.id} className="card-premium p-8 relative">
                    <button type="button" onClick={() => removeCert(index)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                    <div className="space-y-4">
                      <div className="space-y-2"><FormLabel icon={Award}>Title</FormLabel><FormInput {...register(`certificates.${index}.name`)} /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><FormLabel>Category</FormLabel><FormInput {...register(`certificates.${index}.category`)} /></div>
                        <div className="space-y-2"><FormLabel>Year</FormLabel><FormInput {...register(`certificates.${index}.year`)} /></div>
                      </div>
                    </div>
                  </div>
                ))}</div>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* Image Crop Modal */}
      {imageToCrop && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 sm:p-20">
          <div className="w-full max-w-2xl bg-[#1e293b] rounded-4xl overflow-hidden relative shadow-2xl border border-slate-700">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center"><h3 className="text-white font-black text-xl tracking-tight uppercase">Perfect Focus</h3><button onClick={() => setImageToCrop(null)} className="p-2 text-slate-400 hover:text-white transition-colors"><X size={24} /></button></div>
            <div className="relative h-[400px] sm:h-[500px] w-full bg-black"><Cropper image={imageToCrop} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} /></div>
            <div className="p-8 bg-[#1e293b] flex flex-col sm:flex-row items-center gap-8 border-t border-slate-700">
              <div className="flex-1 w-full space-y-4"><input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary" /></div>
              <button onClick={handleCropAndUpload} disabled={uploading} className="w-full sm:w-auto min-w-[200px] h-14 bg-white text-black rounded-full font-black text-sm uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">{uploading ? <Loader2 className="animate-spin" size={20} /> : <><Crop size={20} /> Apply Photo</>}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
