import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Mail, Play, MessageCircle, X, Send, XCircle, ChevronLeft, ChevronRight, Expand, ArrowRight, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Données
const shootingPhotos = [
  '/shooting/1.JPG',
  '/shooting/2.JPG',
  '/shooting/3.JPG',
  '/shooting/4.JPG',
  '/shooting/5.jpeg',
];

const teamMembers = [
  { name: 'Léo Navarro', role: 'Directeur Marketing', image: '/equipe/DSC00009.jpg' },
  { name: 'Matteo Brosolo', role: 'Directeur Communication', image: '/equipe/DSC00011.jpg' },
  { name: 'Matteo Leite', role: 'Co-fondateur & Vidéaste', image: '/equipe/DSC00018.jpg' },
  { name: 'Neil Bettane', role: 'Co-fondateur & Vidéaste', image: '/equipe/DSC00021.jpg' },
  { name: 'Noé Mercier', role: 'Vidéaste', image: '/equipe/DSC00024.jpg' },
  { name: 'Aurélien Branco', role: 'Développeur Web', image: '/equipe/aurelien.png' }
];

const skills = [
  { name: 'Pub', desc: 'Publicité & Marque' },
  { name: 'Interview', desc: 'Portrait & Reportage' },
  { name: 'Motion', desc: 'Animation & Motion Design' },
  { name: 'Photo', desc: 'Shooting & Retouche' },
  { name: 'Réel', desc: 'Réseaux sociaux & Viral' },
];

// Composants optimisés
const TeamMemberCard = memo(({ member }: { member: typeof teamMembers[0] }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="group relative">
      <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-neutral-900">
        {!isLoaded && <div className="absolute inset-0 bg-neutral-800 animate-pulse" />}
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        {/* Info card - style Revolut */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 group-hover:bg-white/15 group-hover:border-yellow-400/30 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-0.5">{member.name}</h3>
            <p className="text-yellow-400/90 text-sm font-medium">{member.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

TeamMemberCard.displayName = 'TeamMemberCard';

const Lightbox = memo(({ images, currentIndex, onClose, onNext, onPrev }: { 
  images: string[]; currentIndex: number; onClose: () => void; onNext: () => void; onPrev: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl" onClick={onClose}>
      <button onClick={onClose} className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
        <XCircle className="w-6 h-6 text-white" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-6 z-50 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
        <ChevronLeft className="w-7 h-7 text-white" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-6 z-50 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
        <ChevronRight className="w-7 h-7 text-white" />
      </button>
      <div className="relative max-w-6xl max-h-[85vh] mx-4" onClick={(e) => e.stopPropagation()}>
        <img src={images[currentIndex]} alt={`Photo ${currentIndex + 1}`} className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-yellow-400 w-6' : 'bg-white/30'}`} />
          ))}
        </div>
      </div>
    </div>
  );
});

Lightbox.displayName = 'Lightbox';

export default function App() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([{ id: '1', text: 'Bonjour! Comment puis-je vous aider?', sender: 'bot', timestamp: new Date() }]);
    }
  }, [chatOpen, messages.length]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), text: chatInput, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ message: chatInput, conversationHistory: messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })) })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: data.reply || 'Désolé, une erreur est survenue.', sender: 'bot', timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: 'Une erreur est survenue.', sender: 'bot', timestamp: new Date() }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message envoyé ! Merci de votre intérêt.');
    setFormData({ name: '', email: '', message: '' });
  };

  const openVideo = (driveUrl: string) => {
    const match = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      setCurrentVideo(`https://drive.google.com/file/d/${match[1]}/preview`);
      setVideoModalOpen(true);
    }
  };

  const openLightbox = useCallback((index: number) => { setLightboxIndex(index); setLightboxOpen(true); }, []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const nextImage = useCallback(() => setLightboxIndex((prev) => (prev + 1) % shootingPhotos.length), []);
  const prevImage = useCallback(() => setLightboxIndex((prev) => (prev - 1 + shootingPhotos.length) % shootingPhotos.length), []);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden antialiased">
      {/* Navigation - Style Apple */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/5' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <a href="#" className="flex items-center gap-3">
            <img src="/LOGO2.png" alt="APPÂT" className="w-10 h-10 object-contain rounded-xl" loading="eager" />
            <span className="font-semibold text-lg tracking-tight hidden sm:block">APPÂT</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {['À propos', 'Équipe', 'Vidéos', 'Photos', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace('à ', '')}`} 
                className="text-[13px] font-medium text-white/70 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
          <a href="#contact" className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-yellow-400 transition-colors">
            Nous contacter
          </a>
        </div>
      </nav>

      {/* Hero - Style Apple */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        
        <div className="relative z-10 text-center px-6 max-w-5xl pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white/80">Création Visuelle Premium</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6">
            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              APPÂT
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/50 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Vidéaste & Direction Artistique.<br />
            <span className="text-white/80">On raconte votre histoire.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#extraits" className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-yellow-400 transition-all">
              Voir nos réalisations
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-xl text-white font-medium rounded-full border border-white/10 hover:bg-white/20 transition-all">
              Discutons
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* About - Style Framer */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="lg:sticky lg:top-32">
              <p className="text-yellow-400 font-medium mb-4 tracking-wide text-sm">À PROPOS</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                Créer des expériences visuelles
                <span className="text-white/40"> mémorables</span>
              </h2>
              <p className="text-lg text-white/50 leading-relaxed mb-6">
                Passionnés par la création visuelle, nous transformons vos idées en contenus captivants. Notre approche combine technique cinématographique et vision artistique.
              </p>
              <p className="text-lg text-white/50 leading-relaxed">
                Nous travaillons avec des marques et des créateurs pour donner vie à leurs projets les plus ambitieux.
              </p>
            </div>
            
            {/* Skills Grid - Style Revolut */}
            <div className="grid grid-cols-2 gap-3">
              {skills.map((skill, i) => (
                <div key={i} className="group p-6 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/5 hover:border-yellow-400/20 transition-all cursor-default">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-black font-bold text-sm">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="font-semibold text-white mb-1">{skill.name}</h3>
                  <p className="text-sm text-white/40">{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="équipe" className="py-32 px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-400 font-medium mb-4 tracking-wide text-sm">L'ÉQUIPE</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Les visages derrière
              <span className="text-white/40"> APPÂT</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <TeamMemberCard key={i} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section id="vidéos" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
            <div>
              <p className="text-yellow-400 font-medium mb-4 tracking-wide text-sm">RÉALISATIONS</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Nos vidéos
              </h2>
            </div>
            <p className="text-white/50 max-w-md">Découvrez nos meilleures créations et plongez dans notre univers visuel.</p>
          </div>
          
          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-2 mb-10">
            {['Tous', 'Interview', 'Motion', 'Pub', 'Réel'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-yellow-400 text-black'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              // Interview
              { title: 'Interview #1', category: 'Interview', driveUrl: 'https://drive.google.com/file/d/1P6W136wc2iE5zxCuVfaLka7bumoqUood/view' },
              { title: 'Interview #2', category: 'Interview', driveUrl: 'https://drive.google.com/file/d/1hy77gNUqS5OssmJcFSSbwmemx8hzwdRn/view' },
              // Motion
              { title: 'Motion #1', category: 'Motion', driveUrl: 'https://drive.google.com/file/d/1rdt2JuTKUWjuXDcpranjLFvFNVCEA_Jq/view' },
              { title: 'Motion #2', category: 'Motion', driveUrl: 'https://drive.google.com/file/d/1JVq9eGOBH-g_a_lnCz_fUlbPtSepzYG2/view' },
              { title: 'Motion #3', category: 'Motion', driveUrl: 'https://drive.google.com/file/d/1RmX3-Lb8k4vOLdpNDjHyI3FkJPuOmU2w/view' },
              { title: 'Motion #4', category: 'Motion', driveUrl: 'https://drive.google.com/file/d/1AK1R5AjEJqI8k7RIGokX-5qWIPLAK6AI/view' },
              { title: 'Motion #5', category: 'Motion', driveUrl: 'https://drive.google.com/file/d/1bin8zrhzlUqlrvDZWxt5l_VTKT989pcN/view' },
              // Pub
              { title: 'Pub #1', category: 'Pub', driveUrl: 'https://drive.google.com/file/d/1HyG7wXRJ1DX92j1C0ZbmO2PLP7v1yWF5/view' },
              { title: 'Pub #2', category: 'Pub', driveUrl: 'https://drive.google.com/file/d/121k2BQcfaER2lJn93HwWzrebpdZANZra/view' },
              // Réel
              { title: 'Réel #1', category: 'Réel', driveUrl: 'https://drive.google.com/file/d/1pZLTe0-hZ65g89vlo6_kxuv9f4Z1Ac9K/view' },
              { title: 'Réel #2', category: 'Réel', driveUrl: 'https://drive.google.com/file/d/1JtmbFyNNXDYZ8ILpCjTSiJEIVDB03Rkc/view' },
              { title: 'Réel #3', category: 'Réel', driveUrl: 'https://drive.google.com/file/d/1NvSSmAs6rTcyse9gyfrN37MFIWPVazOD/view' },
              { title: 'Réel #4', category: 'Réel', driveUrl: 'https://drive.google.com/file/d/1rVIH47eywy8D63xQppsip8AC__qsiuM-/view' },
            ].filter(video => activeCategory === 'Tous' || video.category === activeCategory).map((video, i) => (
              <div key={i} className="group cursor-pointer" onClick={() => openVideo(video.driveUrl)}>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-amber-600/5" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center group-hover:bg-yellow-400 group-hover:scale-110 transition-all duration-300 border border-white/10">
                      <Play className="w-7 h-7 text-white group-hover:text-black ml-1 transition-colors" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-xs font-medium text-white/80 border border-white/10">
                      {video.category}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg group-hover:text-yellow-400 transition-colors">{video.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shooting Photos */}
      <section id="photos" className="py-32 px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-400 font-medium mb-4 tracking-wide text-sm">PHOTOGRAPHIE</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Shooting Photo
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {shootingPhotos.map((photo, i) => (
              <div key={i} onClick={() => openLightbox(i)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-neutral-900">
                <img src={photo} alt={`Shooting ${i + 1}`} loading="lazy" decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
                    <Expand className="w-5 h-5 text-black" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact - Style Framer */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-yellow-400 font-medium mb-4 tracking-wide text-sm">CONTACT</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Un projet en tête ?
            </h2>
            <p className="text-xl text-white/50">Parlons-en et créons quelque chose d'exceptionnel ensemble.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Nom</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 focus:bg-white/[0.07] transition-all"
                  placeholder="Votre nom" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 focus:bg-white/[0.07] transition-all"
                  placeholder="votre@email.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Message</label>
              <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={5}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 focus:bg-white/[0.07] transition-all resize-none"
                placeholder="Parlez-nous de votre projet..." required />
            </div>
            <button type="submit"
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-white text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors">
              <Mail className="w-5 h-5" />
              Envoyer le message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/LOGO2.png" alt="APPÂT" className="w-8 h-8 rounded-lg" />
            <span className="font-medium">APPÂT</span>
          </div>
          <p className="text-white/40 text-sm">© 2025 APPÂT. Tous droits réservés.</p>
        </div>
      </footer>

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl" onClick={() => setVideoModalOpen(false)}>
          <button onClick={() => setVideoModalOpen(false)} className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
            <XCircle className="w-6 h-6 text-white" />
          </button>
          <div className="w-full max-w-5xl mx-4" onClick={(e) => e.stopPropagation()}>
            <iframe src={currentVideo} className="w-full aspect-video rounded-2xl" allow="autoplay; encrypted-media" allowFullScreen />
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && <Lightbox images={shootingPhotos} currentIndex={lightboxIndex} onClose={closeLightbox} onNext={nextImage} onPrev={prevImage} />}

      {/* Chat Button */}
      <button onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-yellow-400 hover:bg-yellow-300 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/25 transition-all hover:scale-105 active:scale-95">
        {chatOpen ? <X className="w-6 h-6 text-black" /> : <MessageCircle className="w-6 h-6 text-black" />}
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-3rem)] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Assistant APPÂT</h3>
                <p className="text-xs text-white/40">En ligne</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px] max-h-[350px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.sender === 'user' ? 'bg-yellow-400 text-black rounded-br-md' : 'bg-white/10 text-white rounded-bl-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-1 px-4 py-3 bg-white/10 rounded-2xl rounded-bl-md w-fit">
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleChatSubmit} className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                placeholder="Votre message..." disabled={chatLoading}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50" />
              <button type="submit" disabled={chatLoading || !chatInput.trim()}
                className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center hover:bg-yellow-300 transition-colors disabled:opacity-40">
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
