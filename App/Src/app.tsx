import { useState, useEffect, useRef } from 'react';
import './App.css';
import { 
  Camera, Video, Check, Play, TrendingUp, TrendingDown, 
  Clock, MapPin, Youtube, 
  Linkedin, Search, Mail, Phone, Menu, X, ChevronRight, Users, Trophy, Calendar
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Dancer {
  id: string; name: string; email: string; style: string; experience: string;
  bio: string; photoUrl: string; videoUrl?: string; score: number;
  trend: 'up' | 'down'; registeredAt: string;
}
interface Session {
  id: number; title: string; instructor: string; style: string; type: string;
  price: number; duration: string; image: string; description: string;
  features: string[]; available: boolean; featured?: boolean;
}
interface Booking {
  id: string; sessionId: number; sessionTitle: string; date: string; time: string;
  name: string; email: string; notes: string; price: number;
}

const CLOUDINARY_CLOUD_NAME = 'dbobmm7by';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';
const DANCE_STYLES = ['Odi Dance','Miondoko','Dancehall/Reggaeton','Street Heat','Amapiano','Afrobeat','Afro Pop','Pop','Tut','Ballet','Hip Hop','Contemporary','Jazz','Salsa','Breakdance','Ballroom','Other'];

const generateDefaultSessions = (): Session[] => [
  { id:1, title:"Odi Dance Masterclass", instructor:"Brian Ochieng", style:"Odi Dance", type:"private", price:1500, duration:"1 hour", image:"https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400", description:"Learn the authentic Odi Dance style from a Kenyan master. Perfect your moves and stage presence.", features:["Personalized feedback","Stage presence training","Music timing"], available:true },
  { id:2, title:"Miondoko Fundamentals", instructor:"Wanjiku Mwangi", style:"Miondoko", type:"group", price:800, duration:"90 min", image:"https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=400", description:"Group session learning traditional Kenyan Miondoko dance with modern twists.", features:["Max 10 students","Cultural context","Traditional steps"], available:true },
  { id:3, title:"Amapiano Moves Workshop", instructor:"Kevin Kamau", style:"Amapiano", type:"group", price:1000, duration:"2 hours", image:"https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400", description:"Master the viral Amapiano dance moves taking over Kenya and Africa.", features:["Trending moves","Social media tips","Freestyle session"], available:true },
  { id:4, title:"Studio Rental - Premium", instructor:"Self-directed", style:"All Styles", type:"studio", price:2500, duration:"2 hours", image:"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400", description:"Full access to our premium Nairobi studio with mirrors, sound system, and sprung floor.", features:["Professional sound system","Full-length mirrors","Climate controlled"], available:true },
  { id:5, title:"Afrobeat Energy Class", instructor:"Grace Akinyi", style:"Afrobeat", type:"private", price:1200, duration:"1 hour", image:"https://images.unsplash.com/photo-1545959570-a925d2a68c82?w=400", description:"High-energy Afrobeat dance class with African rhythms and modern choreography.", features:["Rhythm training","Choreography","Performance skills"], available:true },
  { id:6, title:"Street Heat Intensive", instructor:"David Otieno", style:"Street Heat", type:"group", price:900, duration:"90 min", image:"https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400", description:"Raw street dance energy from the heart of Nairobi. Learn battle techniques and freestyle.", features:["Battle techniques","Freestyle drills","Street culture"], available:true, featured:true }
];

const sampleDancers: Dancer[] = [
  { id:'1', name:'Brian Ochieng', email:'brian@frequency.co.ke', style:'Odi Dance', experience:'Professional', bio:'Master of Odi Dance with performances across East Africa.', photoUrl:'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=200', score:9850, trend:'up', registeredAt:new Date().toISOString() },
  { id:'2', name:'Wanjiku Mwangi', email:'wanjiku@frequency.co.ke', style:'Miondoko', experience:'Advanced', bio:'Miondoko specialist keeping traditional Kenyan dance alive.', photoUrl:'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=200', score:9720, trend:'up', registeredAt:new Date().toISOString() },
  { id:'3', name:'Kevin Kamau', email:'kevin@frequency.co.ke', style:'Amapiano', experience:'Professional', bio:'Leading Amapiano dancer in Nairobi with viral TikTok moves.', photoUrl:'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=200', score:9680, trend:'down', registeredAt:new Date().toISOString() },
  { id:'4', name:'Grace Akinyi', email:'grace@frequency.co.ke', style:'Afrobeat', experience:'Advanced', bio:'Afrobeat queen with energetic performances.', photoUrl:'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=200', score:9540, trend:'up', registeredAt:new Date().toISOString() },
  { id:'5', name:'David Otieno', email:'david@frequency.co.ke', style:'Street Heat', experience:'Intermediate', bio:'Upcoming street dancer from Kibera.', photoUrl:'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200', score:9420, trend:'up', registeredAt:new Date().toISOString() }
];

const AnimatedCounter = ({ target, duration=2000 }: { target:number; duration?:number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const steps = 60; let current = 0; const inc = target/steps;
        const iv = setInterval(() => { current+=inc; if(current>=target){setCount(target);clearInterval(iv);}else setCount(Math.floor(current)); }, duration/steps);
      }
    }, {threshold:0.5});
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const Toast = ({ message, type, onClose }: { message:string; type:'success'|'error'; onClose:()=>void }) => {
  useEffect(() => { const t=setTimeout(onClose,3000); return ()=>clearTimeout(t); }, [onClose]);
  return <div className={`toast ${type} show`}><div className="flex items-center gap-3"><div className={`w-2 h-2 rounded-full ${type==='success'?'bg-green-400':'bg-red-400'}`}/>{message}</div></div>;
};

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  const scrollToSection = (id:string) => { document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setMobileOpen(false); };
  const links = [{label:'Home',id:'home'},{label:'Register',id:'register'},{label:'Leaderboard',id:'leaderboard'},{label:'Bookings',id:'bookings'},{label:'Dancers',id:'dancers'}];
  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled?'py-3 bg-[rgba(10,10,26,0.98)] shadow-[0_5px_30px_rgba(0,243,255,0.1)]':'py-5 bg-[rgba(10,10,26,0.85)]'} backdrop-blur-xl border-b border-[var(--glass-border)]`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Frequency Dance Agency Logo" className="w-10 h-10 rounded-full border-2 border-[var(--neon-cyan)] shadow-[0_0_20px_rgba(0,243,255,0.3)] object-cover"/>
            <span className="font-['Orbitron'] text-base lg:text-xl font-black uppercase tracking-wider neon-text">Frequency Dance Agency</span>
          </div>
          <ul className="hidden md:flex items-center gap-8">
            {links.map(item=>(
              <li key={item.id}>
                <button onClick={()=>scrollToSection(item.id)} className="text-white/80 font-medium uppercase tracking-wider text-sm relative transition-all duration-300 hover:text-[var(--neon-cyan)] after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-[var(--neon-cyan)] after:transition-all after:duration-300 hover:after:w-full">
                  {item.label}
                </button>
              </li>
            ))}
            <li><button onClick={()=>scrollToSection('register')} className="px-6 py-2.5 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] rounded-full font-bold uppercase text-sm tracking-wider text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(0,243,255,0.4)]">Join Now</button></li>
          </ul>
          <button onClick={()=>setMobileOpen(!mobileOpen)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--glass-border)] text-white hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] transition-colors">
            {mobileOpen?<X className="w-5 h-5"/>:<Menu className="w-5 h-5"/>}
          </button>
        </div>
      </nav>
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileOpen?'opacity-100 pointer-events-auto':'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={()=>setMobileOpen(false)}/>
        <div className={`absolute top-0 right-0 h-full w-72 bg-[var(--deep-space)] border-l border-[var(--glass-border)] transition-transform duration-300 ${mobileOpen?'translate-x-0':'translate-x-full'} flex flex-col pt-24 pb-8 px-8`}>
          <ul className="space-y-1 flex-1">
            {links.map(item=>(
              <li key={item.id}>
                <button onClick={()=>scrollToSection(item.id)} className="w-full text-left py-4 text-white font-medium uppercase tracking-wider text-sm border-b border-white/5 flex items-center justify-between hover:text-[var(--neon-cyan)] transition-colors">
                  {item.label}<ChevronRight className="w-4 h-4"/>
                </button>
              </li>
            ))}
          </ul>
          <button onClick={()=>scrollToSection('register')} className="w-full py-4 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] rounded-full font-bold uppercase text-sm tracking-wider text-white">Join Now</button>
        </div>
      </div>
    </>
  );
};

const HeroSection = ({ dancerCount, eventCount, sessionCount }: { dancerCount:number; eventCount:number; sessionCount:number }) => (
  <section id="home" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[radial-gradient(ellipse_at_center,#1a1a3e_0%,var(--deep-space)_70%)] pt-20">
    <div className="relative w-[340px] h-[340px] lg:w-[460px] lg:h-[460px] flex items-center justify-center flex-shrink-0">
      <div className="swirl-ring"/><div className="swirl-ring"/><div className="swirl-ring"/><div className="swirl-ring"/>
      <div className="relative z-10 w-28 h-28 lg:w-36 lg:h-36 bg-black/80 rounded-full flex items-center justify-center border-2 border-[var(--neon-cyan)] shadow-[0_0_50px_rgba(0,243,255,0.5),inset_0_0_30px_rgba(0,243,255,0.2)] animate-[pulse_3s_ease-in-out_infinite] overflow-hidden">
        <img src="/logo.png" alt="Frequency Dance Agency" className="w-full h-full object-cover rounded-full"/>
      </div>
    </div>
    <div className="relative z-20 text-center px-6 mt-8 max-w-3xl">
      <div className="inline-block px-4 py-1.5 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-[var(--neon-cyan)] text-xs uppercase tracking-[0.2em] font-bold mb-5">
        🇰🇪 Kenya's Premier Dancer Platform
      </div>
      <h1 className="font-['Orbitron'] text-4xl md:text-5xl lg:text-6xl font-black mb-5 uppercase leading-tight neon-text-white">
        Kenya's Dance Revolution
      </h1>
      <p className="text-base lg:text-lg text-white/65 mb-10 leading-relaxed max-w-xl mx-auto">
        Join the premier professional dancer network — Odi, Miondoko, Amapiano & more. Register, compete, book, and rise.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#register" onClick={e=>{e.preventDefault();document.getElementById('register')?.scrollIntoView({behavior:'smooth'});}}
          className="inline-block px-10 py-4 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] text-white font-['Orbitron'] font-bold tracking-wider rounded-full transition-all duration-300 uppercase shadow-[0_10px_30px_rgba(0,243,255,0.3)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,243,255,0.5)]">
          Start Your Journey
        </a>
        <a href="#bookings" onClick={e=>{e.preventDefault();document.getElementById('bookings')?.scrollIntoView({behavior:'smooth'});}}
          className="inline-block px-10 py-4 bg-transparent text-white font-['Orbitron'] font-bold tracking-wider rounded-full border-2 border-white/20 transition-all duration-300 uppercase hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]">
          Book a Session
        </a>
      </div>
      <div className="flex justify-center gap-4 lg:gap-10 mt-14 flex-wrap">
        {[{value:dancerCount,label:'Active Dancers',icon:Users},{value:eventCount,label:'Competitions',icon:Trophy},{value:sessionCount,label:'Sessions Booked',icon:Calendar}].map((s,i)=>(
          <div key={i} className="text-center p-5 glass rounded-2xl min-w-[130px] hover:border-[var(--neon-cyan)]/30 transition-all duration-300">
            <s.icon className="w-4 h-4 text-[var(--neon-cyan)]/50 mx-auto mb-2"/>
            <span className="font-['Orbitron'] text-2xl lg:text-3xl font-black text-[var(--neon-cyan)] block"><AnimatedCounter target={s.value}/></span>
            <div className="text-white/55 uppercase tracking-wider text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const RegistrationSection = ({ onRegister, showToast }: { onRegister:(d:Dancer)=>void; showToast:(m:string,t:'success'|'error')=>void }) => {
  const [formData, setFormData] = useState({name:'',email:'',style:'',experience:'Beginner',bio:''});
  const [photoUrl, setPhotoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCloudinaryWidget = (type:'photo'|'video') => {
    if(!(window as any).cloudinary){ showToast('Cloudinary not loaded. Please refresh.','error'); return; }
    const w = (window as any).cloudinary.createUploadWidget(
      { cloudName:CLOUDINARY_CLOUD_NAME, uploadPreset:CLOUDINARY_UPLOAD_PRESET, sources:['local','camera'], multiple:false, maxFiles:1, resourceType:type==='photo'?'image':'video', maxFileSize:type==='photo'?10000000:100000000, ...(type==='video'?{maxVideoDuration:60}:{}), folder:`dance_registry/${type}s`, styles:{palette:{window:'#0a0a1a',windowBorder:'#00f3ff',tabIcon:'#00f3ff',menuIcons:'#00f3ff',textDark:'#ffffff',textLight:'#ffffff',link:'#00f3ff',action:'#ff00ff',inactiveTabIcon:'#666666',error:'#ff0000',inProgress:'#00f3ff',complete:'#00ff00',sourceBg:'#0a0a1a'}} },
      (error:any,result:any) => {
        if(error){ showToast(`Upload failed: ${error.message}`,'error'); return; }
        if(result.event==='success'){
          const url=result.info.secure_url;
          if(type==='photo'){setPhotoUrl(url);setPhotoUploaded(true);showToast('Photo uploaded!','success');}
          else{setVideoUrl(url);setVideoUploaded(true);showToast('Video uploaded!','success');}
        }
      }
    );
    w.open();
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!formData.name||!formData.email||!formData.style||!photoUrl){ showToast('Please fill in all required fields','error'); return; }
    setIsSubmitting(true);
    const d:Dancer = { id:Date.now().toString(), name:formData.name, email:formData.email, style:formData.style, experience:formData.experience, bio:formData.bio, photoUrl, videoUrl, score:Math.floor(Math.random()*2000)+7000, trend:Math.random()>0.5?'up':'down', registeredAt:new Date().toISOString() };
    onRegister(d);
    setFormData({name:'',email:'',style:'',experience:'Beginner',bio:''});
    setPhotoUrl('');setVideoUrl('');setPhotoUploaded(false);setVideoUploaded(false);setIsSubmitting(false);
  };

  return (
    <section id="register" className="py-24 lg:py-32 px-4 lg:px-12 bg-gradient-to-b from-[var(--deep-space)] to-[#0f0f2e]">
      <div className="section-header">
        <h2 className="section-title">Dancer Registration</h2>
        <p className="section-subtitle">Create your professional profile and showcase your Kenyan dance talent</p>
      </div>
      <div className="max-w-4xl mx-auto glass rounded-3xl p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-[var(--glass-border)] hover:border-[var(--neon-cyan)]/15 transition-colors duration-500">
        <div className="flex items-center justify-center gap-3 mb-10">
          {['Personal Info','Dance Details','Media Upload'].map((step,i)=>(
            <div key={i} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center text-xs font-black text-white font-['Orbitron']">{i+1}</div>
                <span className="hidden sm:block text-white/50 text-xs uppercase tracking-wider">{step}</span>
              </div>
              {i<2&&<div className="w-8 lg:w-12 h-px bg-white/10"/>}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <label className="form-label">Full Name <span className="text-[var(--neon-pink)]">*</span></label>
              <Input type="text" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} placeholder="Enter your full name" className="form-input" required/>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address <span className="text-[var(--neon-pink)]">*</span></label>
              <Input type="email" value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} placeholder="your@email.com" className="form-input" required/>
            </div>
            <div className="form-group">
              <label className="form-label">Dance Style <span className="text-[var(--neon-pink)]">*</span></label>
              <Select value={formData.style} onValueChange={v=>setFormData({...formData,style:v})}>
                <SelectTrigger className="form-input"><SelectValue placeholder="Select Style"/></SelectTrigger>
                <SelectContent className="bg-[var(--deep-space)] border-[var(--glass-border)] max-h-[300px]">
                  {DANCE_STYLES.map(s=><SelectItem key={s} value={s} className="text-white">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <Select value={formData.experience} onValueChange={v=>setFormData({...formData,experience:v})}>
                <SelectTrigger className="form-input"><SelectValue/></SelectTrigger>
                <SelectContent className="bg-[var(--deep-space)] border-[var(--glass-border)]">
                  {['Beginner','Intermediate','Advanced','Professional'].map(l=><SelectItem key={l} value={l} className="text-white">{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 form-group">
              <label className="form-label">Biography</label>
              <Textarea value={formData.bio} onChange={e=>setFormData({...formData,bio:e.target.value})} placeholder="Tell us about your dance journey, achievements, and what drives you..." rows={4} className="form-input resize-none"/>
            </div>
            <div className="md:col-span-2 form-group">
              <label className="form-label">Profile Photo <span className="text-[var(--neon-pink)]">*</span></label>
              <div onClick={()=>openCloudinaryWidget('photo')} className="upload-zone">
                {photoUploaded?(
                  <div className="flex flex-col items-center">
                    <img src={photoUrl} alt="Preview" className="w-28 h-28 rounded-full object-cover border-2 border-[var(--neon-cyan)] shadow-[0_0_30px_rgba(0,243,255,0.3)] mb-4"/>
                    <p className="text-[var(--neon-cyan)] text-sm">✓ Uploaded — click to change</p>
                  </div>
                ):(
                  <>
                    <div className="w-16 h-16 rounded-full bg-[var(--neon-cyan)]/10 flex items-center justify-center mx-auto mb-4 border border-[var(--neon-cyan)]/20"><Camera className="w-8 h-8 text-[var(--neon-cyan)]"/></div>
                    <p className="text-base text-white/80 mb-1 font-medium">Click to upload profile photo</p>
                    <p className="text-sm text-white/40">JPG, PNG up to 10MB</p>
                  </>
                )}
              </div>
            </div>
            <div className="md:col-span-2 form-group">
              <label className="form-label">Performance Video <span className="text-white/35 font-normal">(Optional)</span></label>
              <div onClick={()=>openCloudinaryWidget('video')} className="upload-zone">
                {videoUploaded?(
                  <div className="flex flex-col items-center">
                    <video src={videoUrl} className="w-full max-w-md rounded-xl border-2 border-[var(--neon-pink)] shadow-[0_0_30px_rgba(255,0,255,0.2)] mb-4" controls/>
                    <p className="text-[var(--neon-cyan)] text-sm">✓ Uploaded — click to change</p>
                  </div>
                ):(
                  <>
                    <div className="w-16 h-16 rounded-full bg-[var(--neon-pink)]/10 flex items-center justify-center mx-auto mb-4 border border-[var(--neon-pink)]/20"><Video className="w-8 h-8 text-[var(--neon-pink)]"/></div>
                    <p className="text-base text-white/80 mb-1 font-medium">Click to upload performance video</p>
                    <p className="text-sm text-white/40">MP4, MOV up to 100MB · max 60 seconds</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] rounded-xl text-white font-['Orbitron'] text-lg font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(0,243,255,0.4)] disabled:opacity-70 disabled:cursor-not-allowed btn-shine">
            {isSubmitting?<span className="flex items-center justify-center gap-3"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Processing...</span>:'Complete Registration'}
          </button>
        </form>
      </div>
    </section>
  );
};

const LeaderboardSection = ({ dancers }: { dancers:Dancer[] }) => {
  const [activeTab, setActiveTab] = useState('all');
  const tabs = ['all',...DANCE_STYLES.filter(s=>s!=='Other')];
  const filtered = (activeTab==='all'?dancers:dancers.filter(d=>d.style===activeTab)).sort((a,b)=>b.score-a.score);
  const rankCls: Record<number,string> = {0:'rank-gold',1:'rank-silver',2:'rank-bronze'};
  const rankBg: Record<number,string> = {0:'bg-gradient-to-r from-[rgba(255,215,0,0.07)] to-transparent',1:'bg-gradient-to-r from-[rgba(192,192,192,0.04)] to-transparent',2:'bg-gradient-to-r from-[rgba(205,127,50,0.04)] to-transparent'};
  const medals: Record<number,string> = {0:'🥇',1:'🥈',2:'🥉'};
  return (
    <section id="leaderboard" className="py-24 lg:py-32 px-4 lg:px-12 bg-gradient-to-b from-[#0f0f2e] to-[var(--deep-space)]">
      <div className="section-header">
        <h2 className="section-title">Competition Leaderboard</h2>
        <p className="section-subtitle">Real-time rankings of our top performing dancers</p>
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-2 mb-10 overflow-x-auto pb-3" style={{scrollbarWidth:'none',msOverflowStyle:'none'}}>
          {tabs.map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} className={`flex-shrink-0 px-5 py-2.5 rounded-full font-['Orbitron'] font-bold uppercase tracking-wider text-xs transition-all duration-200 border ${activeTab===tab?'bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] border-transparent text-white shadow-[0_5px_20px_rgba(0,243,255,0.25)]':'bg-transparent border-white/10 text-white/55 hover:border-[var(--neon-cyan)]/40 hover:text-[var(--neon-cyan)]'}`}>
              {tab==='all'?'All Styles':tab}
            </button>
          ))}
        </div>
        <div className="glass rounded-2xl overflow-hidden border border-[var(--glass-border)]">
          <div className="grid grid-cols-[56px_1fr_90px_80px] lg:grid-cols-[72px_1fr_160px_140px_110px] gap-4 px-5 py-4 bg-[rgba(0,243,255,0.05)] border-b border-[var(--glass-border)]">
            {['Rank','Dancer','Style','Score','Trend'].map((col,i)=>(
              <div key={col} className={`font-bold uppercase tracking-wider text-[var(--neon-cyan)] text-xs ${i===2||i===3?'hidden lg:block':''} ${i===4?'hidden lg:block':''}`}>{col}</div>
            ))}
          </div>
          {filtered.length===0?(
            <div className="text-center py-16 text-white/35"><Trophy className="w-10 h-10 mx-auto mb-3 opacity-25"/><p className="text-sm">No dancers in this category yet</p></div>
          ):filtered.map((dancer,i)=>(
            <div key={dancer.id} className={`grid grid-cols-[56px_1fr_90px_80px] lg:grid-cols-[72px_1fr_160px_140px_110px] gap-4 px-5 py-4 border-b border-white/[0.03] items-center transition-all duration-200 hover:bg-[rgba(0,243,255,0.03)] group ${rankBg[i]||''}`}>
              <div className={`font-['Orbitron'] text-xl lg:text-2xl font-black text-center ${rankCls[i]||'text-white/40'}`}>#{i+1}</div>
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <img src={dancer.photoUrl} alt={dancer.name} className="w-9 h-9 lg:w-11 lg:h-11 rounded-full object-cover border-2 border-white/10 group-hover:border-[var(--neon-cyan)]/40 transition-colors"/>
                  {medals[i]&&<div className="absolute -top-1 -right-1 text-sm">{medals[i]}</div>}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm lg:text-base">{dancer.name}</div>
                  <div className="text-xs text-white/45 lg:hidden">{dancer.style}</div>
                </div>
              </div>
              <div className="hidden lg:block text-white/65 text-sm">{dancer.style}</div>
              <div className="font-['Orbitron'] text-sm lg:text-lg text-[var(--neon-pink)] font-bold">{dancer.score.toLocaleString()}</div>
              <div className="hidden lg:block">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${dancer.trend==='up'?'trend-up':'trend-down'}`}>
                  {dancer.trend==='up'?<TrendingUp className="w-3 h-3"/>:<TrendingDown className="w-3 h-3"/>}
                  {dancer.trend==='up'?'+5%':'-3%'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const typeColors: Record<string,string> = {
  private:'bg-[rgba(157,0,255,0.12)] text-[#c060ff] border border-[rgba(157,0,255,0.2)]',
  group:'bg-[rgba(0,243,255,0.08)] text-[var(--neon-cyan)] border border-[rgba(0,243,255,0.15)]',
  studio:'bg-[rgba(255,215,0,0.08)] text-[var(--neon-gold)] border border-[rgba(255,215,0,0.15)]',
};

const BookingSection = ({ sessions, onBook }: { sessions:Session[]; onBook:(s:Session)=>void }) => {
  const [sessionType, setSessionType] = useState('all');
  const [bookingStyle, setBookingStyle] = useState('all');
  const filtered = sessions.filter(s=>(sessionType==='all'||s.type===sessionType)&&(bookingStyle==='all'||s.style===bookingStyle));
  return (
    <section id="bookings" className="py-24 lg:py-32 px-4 lg:px-12 bg-gradient-to-b from-[var(--deep-space)] to-[#0f0f2e]">
      <div className="section-header">
        <h2 className="section-title">Book a Session</h2>
        <p className="section-subtitle">Private lessons, group classes, and studio rentals in Nairobi</p>
      </div>
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        <Select value={sessionType} onValueChange={setSessionType}>
          <SelectTrigger className="form-input w-44"><SelectValue placeholder="Session Type"/></SelectTrigger>
          <SelectContent className="bg-[var(--deep-space)] border-[var(--glass-border)]">
            <SelectItem value="all" className="text-white">All Types</SelectItem>
            <SelectItem value="private" className="text-white">Private</SelectItem>
            <SelectItem value="group" className="text-white">Group</SelectItem>
            <SelectItem value="studio" className="text-white">Studio Rental</SelectItem>
          </SelectContent>
        </Select>
        <Select value={bookingStyle} onValueChange={setBookingStyle}>
          <SelectTrigger className="form-input w-44"><SelectValue placeholder="Dance Style"/></SelectTrigger>
          <SelectContent className="bg-[var(--deep-space)] border-[var(--glass-border)] max-h-[300px]">
            <SelectItem value="all" className="text-white">All Styles</SelectItem>
            {DANCE_STYLES.map(s=><SelectItem key={s} value={s} className="text-white">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {filtered.length===0?(
        <div className="text-center py-20 text-white/35"><Calendar className="w-10 h-10 mx-auto mb-3 opacity-25"/><p className="text-sm">No sessions match your filters</p></div>
      ):(
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {filtered.map(session=>(
            <div key={session.id} className={`glass rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,243,255,0.12)] relative group ${session.featured?'border border-[var(--neon-gold)]/35 shadow-[0_0_25px_rgba(255,215,0,0.08)]':'border border-white/5'}`}>
              {session.featured&&<div className="absolute top-4 right-4 bg-gradient-to-r from-[var(--neon-gold)] to-orange-500 text-black px-3 py-1 rounded-full font-bold text-[10px] uppercase z-10 tracking-wider">⭐ Featured</div>}
              <div className="relative overflow-hidden">
                <img src={session.image} alt={session.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"/>
                <div className="absolute bottom-3 left-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${typeColors[session.type]||''}`}>{session.type==='studio'?'Studio Rental':session.type}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-['Orbitron'] text-base text-white leading-snug flex-1">{session.title}</h3>
                  <span className="font-['Orbitron'] text-lg text-[var(--neon-gold)] font-black flex-shrink-0">KES {session.price.toLocaleString()}</span>
                </div>
                <p className="text-white/45 text-xs mb-3">{session.instructor}</p>
                <p className="text-white/55 mb-4 text-sm line-clamp-2 leading-relaxed">{session.description}</p>
                <ul className="mb-4 space-y-1.5">
                  {session.features.map((f,idx)=><li key={idx} className="text-white/65 text-sm flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[var(--neon-cyan)] flex-shrink-0"/>{f}</li>)}
                </ul>
                <div className="flex items-center gap-2 text-white/40 text-xs mb-5"><Clock className="w-3.5 h-3.5"/>{session.duration}</div>
                <button onClick={()=>onBook(session)} disabled={!session.available} className={`w-full py-3.5 rounded-xl font-['Orbitron'] font-bold uppercase tracking-wider text-sm transition-all duration-300 ${session.available?'bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] text-white hover:shadow-[0_8px_25px_rgba(0,243,255,0.3)] hover:-translate-y-0.5':'bg-white/5 cursor-not-allowed opacity-40 text-white/40'}`}>
                  {session.available?'Book Now':'Sold Out'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const DancersGallery = ({ dancers, onPlayVideo }: { dancers:Dancer[]; onPlayVideo:(url:string)=>void }) => (
  <section id="dancers" className="py-24 lg:py-32 px-4 lg:px-12 bg-gradient-to-b from-[#0f0f2e] to-[var(--deep-space)]">
    <div className="section-header">
      <h2 className="section-title">Featured Dancers</h2>
      <p className="section-subtitle">Discover talented performers from our community</p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
      {dancers.slice(0,8).map((dancer,index)=>(
        <div key={dancer.id} className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,243,255,0.12)] group border border-white/5 hover:border-[var(--neon-cyan)]/15">
          <div className="relative h-64 lg:h-72 overflow-hidden">
            <img src={dancer.photoUrl} alt={dancer.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/>
            <div className="absolute top-3 left-3">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${dancer.experience==='Professional'?'bg-[var(--neon-gold)]/20 text-[var(--neon-gold)] border border-[var(--neon-gold)]/25':dancer.experience==='Advanced'?'bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/25':'bg-white/10 text-white/60 border border-white/10'}`}>{dancer.experience}</span>
            </div>
            {dancer.videoUrl&&(
              <button onClick={()=>onPlayVideo(dancer.videoUrl!)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-white/20 hover:border-[var(--neon-cyan)]">
                <Play className="w-5 h-5 text-white ml-1" fill="white"/>
              </button>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-['Orbitron'] text-base text-white mb-0.5">{dancer.name}</h3>
            <p className="text-[var(--neon-cyan)] text-xs uppercase tracking-wider mb-3 font-bold">{dancer.style}</p>
            <p className="text-white/50 text-sm line-clamp-2 mb-4 leading-relaxed">{dancer.bio}</p>
            <div className="flex gap-3 pt-4 border-t border-white/5">
              <div className="text-center flex-1">
                <div className="font-['Orbitron'] text-base text-[var(--neon-pink)] font-bold">{dancer.score.toLocaleString()}</div>
                <div className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">Score</div>
              </div>
              <div className="w-px bg-white/5"/>
              <div className="text-center flex-1">
                <div className={`text-sm font-bold flex items-center justify-center gap-1 ${dancer.trend==='up'?'text-green-400':'text-red-400'}`}>
                  {dancer.trend==='up'?<TrendingUp className="w-3.5 h-3.5"/>:<TrendingDown className="w-3.5 h-3.5"/>}
                  {dancer.trend==='up'?'+5%':'-3%'}
                </div>
                <div className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">Trend</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-black/60 py-16 lg:py-20 px-4 lg:px-12 border-t border-[var(--glass-border)]">
    <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <img src="/logo.png" alt="Logo" className="w-9 h-9 rounded-full border border-[var(--neon-cyan)]/25 object-cover"/>
          <h3 className="font-['Orbitron'] text-[var(--neon-cyan)] text-sm font-bold">Frequency Dance Agency</h3>
        </div>
        <p className="text-white/50 leading-relaxed mb-5 text-sm">Kenya's premier platform for professional dancers to showcase talent, connect with opportunities, and advance their careers.</p>
        <div className="flex gap-3">
          {[
            {href:'https://share.google/S2q2LLvvgKtxglDIM',icon:Search,title:'Google'},
            {href:'https://www.linkedin.com/in/frequency-dance-agency-kenya-376017340',icon:Linkedin,title:'LinkedIn'},
            {href:'https://www.youtube.com/@FrequencyDanceAgency',icon:Youtube,title:'YouTube'},
          ].map(s=>(
            <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" title={s.title} className="social-icon"><s.icon className="w-4 h-4"/></a>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-['Orbitron'] text-[var(--neon-cyan)] mb-5 text-xs font-bold uppercase tracking-wider">Quick Links</h3>
        <ul className="space-y-3">
          {[{label:'Register as Dancer',href:'#register'},{label:'Book a Session',href:'#bookings'},{label:'View Leaderboard',href:'#leaderboard'},{label:'Competition Rules',href:'#'}].map(link=>(
            <li key={link.label}><a href={link.href} className="text-white/50 hover:text-[var(--neon-cyan)] transition-colors duration-200 text-sm flex items-center gap-2 group"><ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -ml-1 transition-opacity"/>{link.label}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-['Orbitron'] text-[var(--neon-cyan)] mb-5 text-xs font-bold uppercase tracking-wider">Contact</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-white/50 text-sm"><Mail className="w-4 h-4 text-[var(--neon-cyan)] mt-0.5 flex-shrink-0"/><span className="break-all">frequencydanceagencykenya@gmail.com</span></li>
          <li className="flex items-center gap-3 text-white/50 text-sm"><Phone className="w-4 h-4 text-[var(--neon-cyan)] flex-shrink-0"/>+254 145 544 71</li>
          <li className="flex items-center gap-3 text-white/50 text-sm"><MapPin className="w-4 h-4 text-[var(--neon-cyan)] flex-shrink-0"/>Nairobi, Kenya</li>
        </ul>
      </div>
      <div>
        <h3 className="font-['Orbitron'] text-[var(--neon-cyan)] mb-5 text-xs font-bold uppercase tracking-wider">Newsletter</h3>
        <p className="text-white/50 mb-4 text-sm leading-relaxed">Subscribe for updates on competitions and exclusive workshops.</p>
        <div className="space-y-3">
          <Input type="email" placeholder="your@email.com" className="form-input"/>
          <button className="w-full py-3 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] rounded-lg text-white font-['Orbitron'] font-bold uppercase tracking-wider text-xs transition-all duration-300 hover:shadow-[0_5px_20px_rgba(0,243,255,0.3)] hover:-translate-y-0.5">Subscribe</button>
        </div>
      </div>
    </div>
    <div className="text-center pt-8 border-t border-white/5 text-white/25 text-xs tracking-wider">
      <p>© 2026 Frequency Dance Agency · All rights reserved · Kenya's Premier Dancer Network</p>
    </div>
  </footer>
);

const MpesaPaymentModal = ({ isOpen, onClose, amount, onComplete }: { isOpen:boolean; onClose:()=>void; amount:number; onComplete:()=>void }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const handlePayment = () => {
    if(!phoneNumber||phoneNumber.length<10) return;
    setIsProcessing(true);
    setTimeout(()=>{setIsProcessing(false);onComplete();onClose();},2000);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-[var(--glass-border)] max-w-md">
        <DialogHeader><DialogTitle className="font-['Orbitron'] text-[var(--neon-cyan)] text-center text-lg">M-Pesa Payment</DialogTitle></DialogHeader>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(0,200,0,0.25)]">
            <span className="text-white font-black text-2xl font-['Orbitron']">M</span>
          </div>
          <p className="text-white/55 text-sm">Pay via M-Pesa</p>
          <p className="text-[var(--neon-gold)] text-3xl font-['Orbitron'] font-black mt-2">KES {(amount*130).toLocaleString()}</p>
          <p className="text-white/35 text-xs mt-1">≈ ${amount} USD</p>
        </div>
        <div className="bg-black/30 p-4 rounded-xl mb-5 border border-[var(--glass-border)]">
          <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-green-400"/><p className="text-white/75 text-sm"><span className="text-[var(--neon-cyan)] font-bold">Buy Goods Number:</span> 9332867</p></div>
          <p className="text-white/40 text-xs pl-4">Enter your M-Pesa phone number to receive the payment prompt</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[var(--neon-cyan)] uppercase text-xs mb-2 font-bold tracking-wider">M-Pesa Phone Number</label>
            <Input type="tel" value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} placeholder="e.g. 0712345678" className="form-input" maxLength={12}/>
          </div>
          <button onClick={handlePayment} disabled={!phoneNumber||phoneNumber.length<10||isProcessing} className="w-full py-4 bg-green-600 rounded-xl text-white font-['Orbitron'] font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:bg-green-500 hover:shadow-[0_10px_30px_rgba(0,200,0,0.25)] disabled:opacity-40 disabled:cursor-not-allowed">
            {isProcessing?<span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Processing...</span>:'Pay with M-Pesa'}
          </button>
          <button onClick={onClose} className="w-full py-3 border border-white/10 rounded-xl text-white/45 font-bold uppercase tracking-wider text-xs transition-all duration-300 hover:border-[var(--neon-cyan)]/35 hover:text-[var(--neon-cyan)]">Cancel</button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const BookingModal = ({ session, isOpen, onClose, onConfirm }: { session:Session|null; isOpen:boolean; onClose:()=>void; onConfirm:(b:Booking)=>void }) => {
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const timeSlots = ['9:00 AM','11:00 AM','2:00 PM','4:00 PM','6:00 PM','8:00 PM'];
  useEffect(()=>{setDate(new Date().toISOString().split('T')[0]);},[]);
  const handleProceed = ()=>{ if(!session||!date||!selectedTime||!name||!email) return; setShowPayment(true); };
  const handlePaymentComplete = ()=>{
    if(!session) return;
    onConfirm({id:Date.now().toString(),sessionId:session.id,sessionTitle:session.title,date,time:selectedTime,name,email,notes,price:session.price});
    setSelectedTime('');setName('');setEmail('');setNotes('');setShowPayment(false);onClose();
  };
  if(!session) return null;
  return (
    <>
      <Dialog open={isOpen&&!showPayment} onOpenChange={onClose}>
        <DialogContent className="glass border-[var(--glass-border)] max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-['Orbitron'] text-[var(--neon-cyan)] text-center text-lg">Book Your Session</DialogTitle></DialogHeader>
          <div className="bg-black/30 p-4 rounded-xl mb-5 border border-[var(--glass-border)]">
            <h4 className="text-white font-bold mb-1 font-['Orbitron'] text-sm">{session.title}</h4>
            <p className="text-white/50 text-xs mb-2">{session.instructor} · {session.style} · {session.duration}</p>
            <p className="text-[var(--neon-gold)] text-xl font-['Orbitron'] font-black">KES {(session.price*130).toLocaleString()}</p>
          </div>
          <div className="space-y-5">
            <div>
              <label className="form-label">Select Date</label>
              <Input type="date" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="form-input"/>
            </div>
            <div>
              <label className="form-label">Select Time Slot</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map(t=><button key={t} type="button" onClick={()=>setSelectedTime(t)} className={`time-slot ${selectedTime===t?'selected':''}`}>{t}</button>)}
              </div>
            </div>
            <div><label className="form-label">Your Name</label><Input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your full name" className="form-input"/></div>
            <div><label className="form-label">Email</label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" className="form-input"/></div>
            <div><label className="form-label">Special Requests</label><Textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any specific goals or requirements..." rows={3} className="form-input resize-none"/></div>
            <button onClick={handleProceed} disabled={!date||!selectedTime||!name||!email} className="w-full py-4 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] rounded-xl text-white font-['Orbitron'] font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,243,255,0.35)] disabled:opacity-40 disabled:cursor-not-allowed">
              Proceed to Payment
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <MpesaPaymentModal isOpen={showPayment} onClose={()=>setShowPayment(false)} amount={session.price} onComplete={handlePaymentComplete}/>
    </>
  );
};

const VideoModal = ({ videoUrl, isOpen, onClose }: { videoUrl:string; isOpen:boolean; onClose:()=>void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(()=>{ if(!isOpen&&videoRef.current) videoRef.current.pause(); },[isOpen]);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 border-[var(--glass-border)] max-w-4xl p-2">
        <video ref={videoRef} src={videoUrl} controls autoPlay className="w-full max-h-[70vh] rounded-lg"/>
      </DialogContent>
    </Dialog>
  );
};

const SuccessModal = ({ isOpen, onClose }: { isOpen:boolean; onClose:()=>void }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="glass border-[var(--glass-border)] max-w-sm text-center p-8">
      <div className="relative w-20 h-20 mx-auto mb-5">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] rounded-full animate-[pulse_2s_ease-in-out_infinite] opacity-50"/>
        <div className="relative w-full h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] rounded-full flex items-center justify-center">
          <Check className="w-10 h-10 text-white"/>
        </div>
      </div>
      <h3 className="font-['Orbitron'] text-xl text-white mb-2">Registration Complete!</h3>
      <p className="text-white/55 mb-6 text-sm leading-relaxed">Your profile has been added to our database and is now live on the website.</p>
      <button onClick={onClose} className="px-8 py-3 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] rounded-full text-white font-['Orbitron'] font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,243,255,0.4)]">Continue</button>
    </DialogContent>
  </Dialog>
);

function App() {
  const [dancers, setDancers] = useState<Dancer[]>(sampleDancers);
  const [sessions] = useState<Session[]>(generateDefaultSessions());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session|null>(null);
  const [playingVideo, setPlayingVideo] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState<{message:string;type:'success'|'error'}|null>(null);
  const showToastMessage = (m:string,t:'success'|'error') => setToast({message:m,type:t});
  const handleRegister = (d:Dancer) => { setDancers([d,...dancers]); setShowSuccess(true); showToastMessage('Registration successful!','success'); };
  const handleConfirmBooking = (b:Booking) => { setBookings([...bookings,b]); showToastMessage('Booking confirmed! Check your email.','success'); };
  return (
    <div className="min-h-screen bg-[var(--deep-space)]">
      <Navigation/>
      <HeroSection dancerCount={dancers.length+1247} eventCount={48} sessionCount={bookings.length+3892}/>
      <RegistrationSection onRegister={handleRegister} showToast={showToastMessage}/>
      <LeaderboardSection dancers={dancers}/>
      <BookingSection sessions={sessions} onBook={setSelectedSession}/>
      <DancersGallery dancers={dancers} onPlayVideo={setPlayingVideo}/>
      <Footer/>
      <BookingModal session={selectedSession} isOpen={!!selectedSession} onClose={()=>setSelectedSession(null)} onConfirm={handleConfirmBooking}/>
      <VideoModal videoUrl={playingVideo} isOpen={!!playingVideo} onClose={()=>setPlayingVideo('')}/>
      <SuccessModal isOpen={showSuccess} onClose={()=>setShowSuccess(false)}/>
      {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    </div>
  );
}

export default App;
