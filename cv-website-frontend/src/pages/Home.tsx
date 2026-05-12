import { useEffect, useState } from 'react';
import {
  Mail, Phone, MapPin, Download,
  Calendar, User, Sun, Moon,
  GraduationCap, Briefcase,
  Layout, Link
} from 'lucide-react';
import api, { BASE_URL } from '../services/api';

const getImageUrl = (url: string) => {
  console.log('Original URL:', url);
  console.log('Current BASE_URL:', BASE_URL);
  
  if (!url) return '';
  if (url.startsWith('http')) {
    // Thay thế linh hoạt hơn (chấp nhận cả http và https của localhost)
    if (url.includes('localhost:5001')) {
      const newUrl = url.replace(/https?:\/\/localhost:5001/, BASE_URL);
      console.log('Fixed URL:', newUrl);
      return newUrl;
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
    download: "Xuất PDF / In"
  },
  en: {
    jobTitle: "Software Developer", objective: "Career Objective", skills: "Professional Skills",
    interests: "Interests", education: "Education", experience: "Work Experience",
    contact: "Contact", birthday: "Birthday", gender: "Gender", male: "Male",
    download: "Export PDF / Print"
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
    <div className="min-h-screen bg-slate-100 dark:bg-brand-dark p-0 sm:p-4 lg:p-10 transition-colors duration-500 font-sans">

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

      <div className="max-w-[900px] mx-auto bg-white dark:bg-brand-card shadow-2xl flex flex-col md:flex-row min-h-[1272px] overflow-hidden cv-container cv-wrapper ring-1 ring-slate-200 dark:ring-brand-border">

        {/* SIDEBAR - LEFT */}
        <aside className="w-full md:w-[35%] bg-[#1a2b3c] text-white p-8 space-y-12 shrink-0">

          <div className="flex flex-col items-center space-y-6 pt-4">
            <div className="size-56 lg:size-64 rounded-full border-[6px] border-white/10 p-2 overflow-hidden bg-slate-700 shadow-2xl">
              {cv.avatar ? (
                <img src={getImageUrl(cv.avatar)} alt={cv.fullName} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20"><User size={90} /></div>
              )}
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black tracking-tight uppercase leading-tight">{cv.fullName}</h1>
              <p className="text-lg text-slate-400 font-medium uppercase tracking-wider">{cv.jobTitle}</p>
            </div>
          </div>

          <section className="space-y-2 section">
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="size-8 bg-white/10 rounded-full flex items-center justify-center shrink-0"><Phone size={14} /></div>
              <span>{cv.contact.phone || "---"}</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="size-8 bg-white/10 rounded-full flex items-center justify-center shrink-0"><Mail size={14} /></div>
              <span className="truncate">{cv.contact.email || "---"}</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="size-8 bg-white/10 rounded-full flex items-center justify-center shrink-0"><MapPin size={14} /></div>
              <span>{cv.contact.location || "---"}</span>
            </div>
            {cv.contact.linkedin && (
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="size-8 bg-white/10 rounded-full flex items-center justify-center shrink-0"><Link size={14} /></div>
                <a href={cv.contact.linkedin.startsWith('http') ? cv.contact.linkedin : `https://${cv.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="truncate hover:text-blue-400 transition-colors">
                  {cv.contact.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>
            )}
            {cv.birthday && (
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="size-8 bg-white/10 rounded-full flex items-center justify-center shrink-0"><Calendar size={14} /></div>
                <span>{cv.birthday}</span>
              </div>
            )}
            {cv.gender && (
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="size-8 bg-white/10 rounded-full flex items-center justify-center shrink-0"><User size={14} /></div>
                <span>{cv.gender}</span>
              </div>
            )}
          </section>

          <section className="space-y-4 section">
            <h2 className="text-xl font-black border-b-2 border-white/10 pb-2 uppercase tracking-wider">{t.objective}</h2>
            <p className="text-[13px] leading-relaxed opacity-80 font-medium">{cv.introduction}</p>
          </section>

          <section className="space-y-4 section">
            <h2 className="text-xl font-black border-b-2 border-white/10 pb-2 uppercase tracking-wider">{t.skills}</h2>
            <div className="space-y-4">
              {cv.skills.length > 0 ? cv.skills.map((skill, index) => (
                <div key={index} className="space-y-1.5">
                  <p className="text-xs font-bold opacity-90 uppercase tracking-wide">{skill.name}</p>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/40 rounded-full" style={{ width: skill.level }} />
                  </div>
                </div>
              )) : <p className="text-xs opacity-40 italic">Chưa cập nhật</p>}
            </div>
          </section>

          <section className="space-y-4 section">
            <h2 className="text-xl font-black border-b-2 border-white/10 pb-2 uppercase tracking-wider">{t.interests}</h2>
            <ul className="grid grid-cols-2 gap-2 text-sm opacity-80 font-medium">
              {cv.interests ? cv.interests.split(',').map((interest, i) => (
                <li key={i} className="flex items-center gap-2 truncate"><span className="size-1.5 bg-white rounded-full" /> {interest.trim()}</li>
              )) : <li className="text-xs opacity-40 italic">---</li>}
            </ul>
          </section>
        </aside>

        {/* CONTENT AREA - RIGHT */}
        <main className="flex-1 bg-white dark:bg-brand-card p-10 lg:p-14 space-y-14 transition-colors">

          <section className="space-y-6 section">
            <div className="flex items-center gap-4 text-[#1a2b3c] dark:text-white border-b-4 border-[#1a2b3c] dark:border-white/20 pb-4">
              <div className="size-10 bg-[#1a2b3c] text-white rounded-full flex items-center justify-center shrink-0"><GraduationCap size={20} /></div>
              <h2 className="text-2xl font-black uppercase tracking-tight">{t.education}</h2>
            </div>

            <div className="space-y-8">
              {cv.education.length > 0 ? cv.education.map((edu, index) => (
                <div key={index} className="space-y-3 education-item">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white uppercase leading-tight">{edu.major}</h3>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{edu.school}</p>
                    </div>
                    <span className="text-[13px] font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-md">{edu.startDate} – {edu.endDate}</span>
                  </div>
                  {/* Tích hợp chứng chỉ vào mục giáo dục như ảnh mẫu */}
                  {cv.certificates.length > 0 && index === 0 && (
                    <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400 font-medium ml-1">
                      {cv.certificates.map((cert, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-2 size-1 bg-[#1a2b3c] dark:bg-white rounded-full shrink-0" />
                          {cert.name} {cert.year && `(${cert.year})`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )) : <p className="text-slate-400 italic text-sm">Chưa cập nhật học vấn.</p>}
            </div>
          </section>

          <section className="space-y-10 section">
            <div className="flex items-center gap-4 text-[#1a2b3c] dark:text-white border-b-4 border-[#1a2b3c] dark:border-white/20 pb-4">
              <div className="size-10 bg-[#1a2b3c] text-white rounded-full flex items-center justify-center shrink-0"><Briefcase size={20} /></div>
              <h2 className="text-2xl font-black uppercase tracking-tight">{t.experience}</h2>
            </div>

            <div className="space-y-10">
              {cv.experience.length > 0 ? cv.experience.map((exp, index) => (
                <div key={index} className="space-y-3 job-item">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{exp.position}</h3>
                      <p className="text-base font-bold text-slate-700 dark:text-slate-300">{exp.company}</p>
                    </div>
                    <span className="text-[13px] font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-md">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="space-y-2.5">
                    {exp.description.split('.').filter(p => p.trim()).map((point, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        <span className="mt-2 size-1 bg-[#1a2b3c] dark:bg-white rounded-full shrink-0" />
                        {point.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              )) : <p className="text-slate-400 italic text-sm">Chưa cập nhật kinh nghiệm.</p>}
            </div>
          </section>

        </main>
      </div>

      <footer className="max-w-[1000px] mx-auto py-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
        NGUYEN THANH HAO • CV
      </footer>
    </div>
  );
}
