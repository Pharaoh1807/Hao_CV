import { useEffect, useState } from 'react';
import {
  Mail, Phone, MapPin, Download,
  Calendar, User, Sun, Moon,
  GraduationCap, Briefcase,
  Layout, Link as LinkIcon, Award
} from 'lucide-react';
import api, { BASE_URL } from '../services/api';

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

interface CVData {
  fullName: string;
  jobTitle: string;
  introduction: string;
  avatar: string;
  birthday?: string;
  gender?: string;
  interests?: string;
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

const translations = {
  vi: {
    jobTitle: "Lập trình viên", objective: "Mục tiêu nghề nghiệp", skills: "Kỹ năng",
    interests: "Sở thích", education: "Học vấn", experience: "Kinh nghiệm làm việc",
    contact: "Liên hệ", birthday: "Ngày sinh", gender: "Giới tính", male: "Nam",
    download: "Xuất PDF / In", certificates: "Chứng chỉ"
  },
  en: {
    jobTitle: "Software Developer", objective: "Career Objective", skills: "Professional Skills",
    interests: "Interests", education: "Education", experience: "Work Experience",
    contact: "Contact", birthday: "Birthday", gender: "Gender", male: "Male",
    download: "Export PDF / Print", certificates: "Certificates"
  }
};

export default function Home() {
  const [data, setData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [lang, setLang] = useState<'vi' | 'en'>((localStorage.getItem('lang') as 'vi' | 'en') || 'vi');

  const t = translations[lang];

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const res = await api.get('/cv');
        if (res.data && res.data.fullName) {
          setData(res.data);
        }
      } catch (error) {
        console.error('Error fetching CV:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCV();
  }, []);

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

  const toggleLang = () => {
    const newLang = lang === 'vi' ? 'en' : 'vi';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-dark">
        <div className="animate-spin text-[#1a2b3c] dark:text-white"><Layout size={40} /></div>
      </div>
    );
  }

  const cv = data || {
    fullName: "CHƯA CÓ DỮ LIỆU",
    jobTitle: "Cập nhật tại /admin",
    introduction: "Hãy đăng nhập vào trang /admin để cập nhật thông tin cá nhân.",
    avatar: "",
    birthday: "",
    gender: "",
    interests: "",
    contact: { email: "", phone: "", location: "", linkedin: "", github: "", twitter: "" },
    experience: [],
    education: [],
    skills: [],
    certificates: []
  };

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-brand-dark p-0 sm:p-4 lg:p-10 transition-colors duration-500 font-sans">

      {/* Floating Action Buttons */}
      <div className="fixed top-6 right-6 z-50 flex gap-3 print:hidden">
        <button onClick={toggleLang} className="px-4 h-12 flex items-center justify-center bg-white dark:bg-brand-card text-slate-700 dark:text-white rounded-full shadow-xl border border-slate-200 dark:border-brand-border hover:scale-110 transition-transform font-black text-xs">
          {lang === 'vi' ? 'VI' : 'EN'}
        </button>
        <button onClick={toggleTheme} className="size-12 flex items-center justify-center bg-white dark:bg-brand-card text-slate-700 dark:text-white rounded-full shadow-xl border border-slate-200 dark:border-brand-border hover:scale-110 transition-transform">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button onClick={() => window.print()} className="size-12 flex items-center justify-center bg-[#1a2b3c] text-white rounded-full shadow-xl hover:scale-110 transition-transform">
          <Download size={20} />
        </button>
      </div>

      {/* CV CONTAINER */}
      <div className="max-w-[900px] mx-auto bg-white dark:bg-brand-card shadow-2xl flex flex-col md:flex-row min-h-[1272px] overflow-hidden cv-container cv-wrapper ring-1 ring-slate-200 dark:ring-brand-border print:shadow-none print:ring-0 print:m-0 print:w-full print:min-h-0">

        {/* SIDEBAR - LEFT */}
        <aside className="w-full md:w-[35%] bg-slate-50 dark:bg-cv-navy text-slate-800 dark:text-white p-8 space-y-12 shrink-0 border-r border-slate-200 dark:border-brand-border/30 print:bg-[#1a2b3c] print:text-white print:border-none print:w-[35%]">

          <div className="flex flex-col items-center space-y-6 pt-4">
            <div className="size-56 lg:size-64 rounded-full border-[6px] border-slate-200 dark:border-white/10 p-2 overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-xl print:border-white/20 print:bg-slate-700">
              {cv.avatar ? (
                <img src={getImageUrl(cv.avatar)} alt={cv.fullName} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-white/20 print:text-white/20"><User size={90} /></div>
              )}
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black tracking-tight uppercase leading-tight text-slate-900 dark:text-white print:text-white">{cv.fullName}</h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider print:text-slate-300">{cv.jobTitle}</p>
            </div>
          </div>

          <section className="space-y-4 section">
            <div className="flex items-center gap-4 text-sm font-medium print:text-white">
              <div className="size-8 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center shrink-0 print:bg-white/10"><Phone size={14} /></div>
              <span>{cv.contact.phone || "---"}</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium print:text-white">
              <div className="size-8 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center shrink-0 print:bg-white/10"><Mail size={14} /></div>
              <span className="truncate">{cv.contact.email || "---"}</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium print:text-white">
              <div className="size-8 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center shrink-0 print:bg-white/10"><MapPin size={14} /></div>
              <span>{cv.contact.location || "---"}</span>
            </div>
            {cv.contact.linkedin && (
              <div className="flex items-center gap-4 text-sm font-medium print:text-white">
                <div className="size-8 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center shrink-0 print:bg-white/10"><LinkIcon size={14} /></div>
                <a href={cv.contact.linkedin.startsWith('http') ? cv.contact.linkedin : `https://${cv.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors print:text-white">
                  {cv.contact.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>
            )}
            {cv.birthday && (
              <div className="flex items-center gap-4 text-sm font-medium print:text-white">
                <div className="size-8 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center shrink-0 print:bg-white/10"><Calendar size={14} /></div>
                <span>{cv.birthday}</span>
              </div>
            )}
            {cv.gender && (
              <div className="flex items-center gap-4 text-sm font-medium print:text-white">
                <div className="size-8 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center shrink-0 print:bg-white/10"><User size={14} /></div>
                <span>{cv.gender}</span>
              </div>
            )}
          </section>

          <section className="space-y-4 section">
            <h2 className="text-xl font-black border-b-2 border-slate-200 dark:border-white/10 pb-2 uppercase tracking-wider text-slate-900 dark:text-white print:text-white print:border-white/20">{t.objective}</h2>
            <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium print:text-slate-100">{cv.introduction}</p>
          </section>

          <section className="space-y-4 section">
            <h2 className="text-xl font-black border-b-2 border-slate-200 dark:border-white/10 pb-2 uppercase tracking-wider text-slate-900 dark:text-white print:text-white print:border-white/20">{t.skills}</h2>
            <div className="space-y-4">
              {cv.skills.length > 0 ? cv.skills.map((skill, index) => (
                <div key={index} className="space-y-1.5">
                  <p className="text-xs font-bold text-slate-700 dark:text-white/90 uppercase tracking-wide print:text-white/90">{skill.name}</p>
                  <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden print:bg-white/10">
                    <div className="h-full bg-slate-500 dark:bg-white/40 rounded-full print:bg-white/60" style={{ width: skill.level }} />
                  </div>
                </div>
              )) : <p className="text-xs opacity-40 italic">Chưa cập nhật</p>}
            </div>
          </section>

          <section className="space-y-4 section">
            <h2 className="text-xl font-black border-b-2 border-slate-200 dark:border-white/10 pb-2 uppercase tracking-wider text-slate-900 dark:text-white print:text-white print:border-white/20">{t.interests}</h2>
            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-white/80 font-medium print:text-slate-100">
              {cv.interests ? cv.interests.split(',').map((interest, i) => (
                <li key={i} className="flex items-center gap-2 truncate"><span className="size-1.5 bg-slate-400 dark:bg-white rounded-full print:bg-white" /> {interest.trim()}</li>
              )) : <li className="text-xs opacity-40 italic">---</li>}
            </ul>
          </section>
        </aside>

        {/* MAIN CONTENT - RIGHT */}
        <main className="flex-1 p-10 space-y-12 bg-white dark:bg-brand-card print:bg-white print:p-10 print:w-[65%]">
          
          <section className="space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-3 text-slate-900 dark:text-white print:text-slate-900">
              <div className="size-10 bg-slate-100 dark:bg-brand-border rounded-xl flex items-center justify-center print:bg-slate-100"><Briefcase className="text-primary" /></div>
              <span className="uppercase tracking-tight">{t.experience}</span>
            </h2>
            <div className="space-y-8 border-l-2 border-slate-100 dark:border-brand-border ml-5 pl-8 print:border-slate-100">
              {cv.experience.length > 0 ? cv.experience.map((exp, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -left-[41px] top-1.5 size-4 bg-white dark:bg-brand-card border-4 border-primary rounded-full transition-transform group-hover:scale-125 print:bg-white" />
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white print:text-slate-900">{exp.position}</h3>
                      <p className="text-primary font-bold text-lg">{exp.company}</p>
                    </div>
                    <span className="text-[11px] font-black px-3 py-1 bg-slate-900 dark:bg-brand-border text-white rounded-full uppercase tracking-wider print:bg-slate-800">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <ul className="space-y-2">
                    {exp.description.split('\n').filter(item => item.trim()).map((item, i) => (
                      <li key={i} className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2 print:text-slate-700">
                        <span className="mt-1.5 size-1.5 bg-primary rounded-full shrink-0" />
                        {item.trim().startsWith('-') ? item.trim().substring(1).trim() : item.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )) : <p className="text-sm opacity-40 italic">Chưa cập nhật</p>}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-3 text-slate-900 dark:text-white print:text-slate-900">
              <div className="size-10 bg-slate-100 dark:bg-brand-border rounded-xl flex items-center justify-center print:bg-slate-100"><GraduationCap className="text-primary" /></div>
              <span className="uppercase tracking-tight">{t.education}</span>
            </h2>
            <div className="space-y-8 border-l-2 border-slate-100 dark:border-brand-border ml-5 pl-8 print:border-slate-100">
              {cv.education.length > 0 ? cv.education.map((edu, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -left-[41px] top-1.5 size-4 bg-white dark:bg-brand-card border-4 border-primary rounded-full transition-transform group-hover:scale-125 print:bg-white" />
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white print:text-slate-900">{edu.major}</h3>
                      <p className="text-primary font-bold text-lg">{edu.school}</p>
                    </div>
                    <span className="text-[11px] font-black px-3 py-1 bg-slate-900 dark:bg-brand-border text-white rounded-full uppercase tracking-wider print:bg-slate-800">{edu.startDate} – {edu.endDate}</span>
                  </div>
                </div>
              )) : <p className="text-sm opacity-40 italic">Chưa cập nhật</p>}
            </div>
          </section>

          {cv.certificates.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-black flex items-center gap-3 text-slate-900 dark:text-white print:text-slate-900">
                <div className="size-10 bg-slate-100 dark:bg-brand-border rounded-xl flex items-center justify-center print:bg-slate-100"><Award className="text-primary" /></div>
                <span className="uppercase tracking-tight">{t.certificates}</span>
              </h2>
              <div className="space-y-4 border-l-2 border-slate-100 dark:border-brand-border ml-5 pl-8 print:border-slate-100">
                {cv.certificates.map((cert, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute -left-[41px] top-1.5 size-4 bg-white dark:bg-brand-card border-4 border-primary rounded-full transition-transform group-hover:scale-125 print:bg-white" />
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 print:text-slate-800">{cert.name}</h3>
                      <span className="text-[10px] font-black text-slate-400 uppercase print:text-slate-500">{cert.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <footer className="max-w-[900px] mx-auto py-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] print:hidden">
        {cv.fullName} • CV
      </footer>
    </div>
  );
}
