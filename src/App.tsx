import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Mail, Play, MessageCircle, X, Send, XCircle, ChevronLeft, ChevronRight, Expand, ArrowRight, Sparkles, Star } from 'lucide-react';

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

// Logos partenaires
const partnerLogos: string[] = [
  '/marque/LOGO-HOLESHOT-HORIZ.png',
  '/marque/Logo-Bazehouse1.png',
  '/marque/Logo_HBi-04.png',
  '/marque/Logo_EVOM_vert.png',
  '/marque/logo Solution recouvrement.png',
  '/marque/logo RT connecting.png',
  '/marque/nation_beta_logo.jpeg',
  '/marque/images.jpeg',
  '/marque/1630608594440.jpeg',
  '/marque/lien-AVLaw9pprauvZM4M.webp.jpeg',
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
  const [currentVideoMeta, setCurrentVideoMeta] = useState<{ title: string; description: string; category: string } | null>(null);
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
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  useEffect(() => {
    if (chatOpen) {
      setMessages(prev => {
        if (prev.length === 0) {
          return [{ id: '1', text: 'Bonjour! Comment puis-je vous aider?', sender: 'bot', timestamp: new Date() }];
        }
        return prev;
      });
    }
  }, [chatOpen]);

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

  const openVideo = (video: { driveUrl: string; title: string; description: string; category: string }) => {
    const match = video.driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      setCurrentVideo(`https://drive.google.com/file/d/${match[1]}/preview`);
      setCurrentVideoMeta({
        title: video.title,
        description: video.description,
        category: video.category,
      });
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
            Equipe de Production<br />
            <span className="text-white/80">On raconte votre histoire.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#vidéos" className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-yellow-400 transition-all">
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
              Fondée en 2025 à Lyon par Matteo Leite et Neil Betane, Appât est une société de production audiovisuelle qui transforme l’image de marque en levier de croissance.
              </p>
              <p className="text-lg text-white/50 leading-relaxed">
              Notre collectif de six experts crée des contenus publicitaires et capte des événements avec une exigence cinématographique et une vision stratégique.
              </p>
            </div>
            
            {/* Photo à la place du bloc de compétences */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-full max-w-xl aspect-video rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02]">
                <img
                  src="/equipe/équipe.png"
                  alt="Tournage APPÂT"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">Derrière la caméra</p>
                    <p className="text-sm md:text-base font-medium text-white/90">
                      Une équipe dédiée à transformer votre image en histoire.
                    </p>
                  </div>
                </div>
              </div>
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
          <div className="mb-12">
            <p className="text-yellow-400 font-medium mb-4 tracking-wide text-sm">RÉALISATIONS</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Nos vidéos
            </h2>
            <p className="text-white/50 max-w-2xl">
              Découvrez nos meilleures créations et plongez dans notre univers visuel.
            </p>
          </div>
          
          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-2 mb-10">
            {['Tous', 'Interview', 'Pub', 'After Movie'].map((cat) => (
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
              {
                title: 'Interview - Lazy',
                category: 'Interview',
                driveUrl: 'https://drive.google.com/file/d/1P6W136wc2iE5zxCuVfaLka7bumoqUood/view',
                thumbnail: '/miniature/interview1.png',
                description: 'Portrait de Lazy, artiste parisien venu à Lyon pour une interview avec le média Censure, où il revient sur son parcours et annonce son prochain album.'
              },
              {
                title: 'Interview - Camper X',
                category: 'Interview',
                driveUrl: 'https://drive.google.com/file/d/1hy77gNUqS5OssmJcFSSbwmemx8hzwdRn/view',
                thumbnail: '/miniature/interview2.png',
                description: 'Interview de Fabrice et Paulette, clients Camper X, qui racontent comment leur cellule off-road leur a permis d’adopter un nouveau mode de vie dans le désert marocain.'
              },
              // Pub
              {
                title: 'Publicité - Holeshot Hydro',
                category: 'Pub',
                driveUrl: 'https://drive.google.com/file/d/1HyG7wXRJ1DX92j1C0ZbmO2PLP7v1yWF5/view',
                thumbnail: '/miniature/pub1.png',
                description: 'Spot pour Holeshot Hydro, la nouvelle gamme de boisson énergisante tournée vers les sports d’équipe, conçue après un échange créatif avec le responsable marketing.'
              },
              {
                title: 'Publicité - Nation',
                category: 'Pub',
                driveUrl: 'https://drive.google.com/file/d/121k2BQcfaER2lJn93HwWzrebpdZANZra/view',
                thumbnail: '/miniature/pub2.png',
                description: 'Film publicitaire pour Nation, l’application qui connecte entrepreneurs et porteurs de projets, réalisé dans le cadre d’un concours d’aide au financement remporté par la marque.'
              },
              // After Movie
              {
                title: 'After Movie - Nouveau T-Roc',
                category: 'After Movie',
                driveUrl: 'https://drive.google.com/file/d/1JsLDXBwLQh6VNExPcGJqGLkuthpl6pBA/view?usp=sharing',
                thumbnail: '/miniature/t-roc.png',
                description: 'After movie d’un événement coorganisé par BYMYCAR Volkswagen et La Cave d’Or, mettant en avant un moment de convivialité autour du nouveau T-Roc.'
              },
              {
                title: 'After Movie - Clio 6',
                category: 'After Movie',
                driveUrl: 'https://drive.google.com/file/d/1Tae00K7FpQ1s6Cqlhuw_aAIzEOPqh9aS/view?usp=sharing',
                thumbnail: '/miniature/clio.png',
                description: 'After movie de la soirée de lancement de la nouvelle Clio 6 pour BYMYCAR Renault, destiné à immortaliser l’événement et à renforcer le lien avec clients et collaborateurs.'
              },
            ]
              .filter(video => activeCategory === 'Tous' || video.category === activeCategory)
              .map((video, i) => (
                <div key={i} className="group cursor-pointer" onClick={() => openVideo(video)}>
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 mb-4">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:blur-sm"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-amber-600/5" />
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 backdrop-blur-none group-hover:backdrop-blur-sm transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center group-hover:bg-yellow-400 group-hover:scale-110 transition-all duration-300 border border-white/10">
                        <Play className="w-7 h-7 text-white group-hover:text-black ml-1 transition-colors" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-xs font-medium text-white/80 border border-white/10">
                        {video.category}
                      </span>
                    </div>
                    <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-sm font-semibold text-white mb-1">{video.title}</h3>
                      <p className="text-xs text-white/70 leading-snug line-clamp-2">
                        {video.description}
                      </p>
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

      {/* Testimonials */}
      <section id="avis" className="py-32 px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-400 font-medium mb-4 tracking-wide text-sm">TÉMOIGNAGES</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Ce que disent nos
              <span className="text-white/40"> clients</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Holeshot',
                role: 'Client',
                text: 'Appât a su mettre en image nos idées pour le lancement de la gamme Holeshot Hydro, en respectant parfaitement nos attentes après les échanges créatifs.',
                rating: 4
              },
              {
                name: 'Wake up',
                role: 'Client',
                text: 'Le montage proposé par Appât répondait totalement à notre vision.',
                rating: 5
              },
              {
                name: 'Nation',
                role: 'Client',
                text: 'L’échange et toutes les étapes de création ont été très fluides, ce qui nous a permis d’aboutir à cette superbe création.',
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-yellow-400/20 hover:bg-white/[0.05] transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star 
                      key={`star-${i}-${j}`} 
                      className={`w-4 h-4 ${
                        j < testimonial.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'fill-white/20 text-white/20'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-white/70 mb-6 leading-relaxed text-sm">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-white mb-1">{testimonial.name}</p>
                  <p className="text-sm text-white/50">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partenaires" className="py-24 px-6 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-yellow-400 font-medium mb-4 tracking-wide text-sm">PARTENAIRES</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ils nous font
              <span className="text-white/40"> confiance</span>
            </h2>
          </div>
          
          {partnerLogos && partnerLogos.length > 0 ? (
            <div className="partners-container">
              <div className="partners-scroll flex items-center">
                {/* Première série de logos */}
                {partnerLogos.map((logo, i) => (
                  <div key={`partner-${i}`} className="flex-shrink-0 w-32 h-24 mx-4 flex items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-yellow-400/20 transition-all group">
                    <img 
                      src={logo} 
                      alt={`Partenaire ${i + 1}`}
                      className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                      loading="lazy"
                    />
                  </div>
                ))}
                {/* Deuxième série (dupliquée pour l'effet de boucle) */}
                {partnerLogos.map((logo, i) => (
                  <div key={`partner-duplicate-${i}`} className="flex-shrink-0 w-32 h-24 mx-4 flex items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-yellow-400/20 transition-all group">
                    <img 
                      src={logo} 
                      alt={`Partenaire ${i + 1}`}
                      className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-40">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={`placeholder-${i}`} className="w-full h-24 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-yellow-400/20 transition-all">
                    <span className="text-white/20 text-xs font-medium">Logo {i}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-white/40 text-sm mt-8">
                Ajoutez vos logos dans <code className="bg-white/5 px-2 py-1 rounded text-xs">public/partenaires/</code> et mettez à jour le tableau <code className="bg-white/5 px-2 py-1 rounded text-xs">partnerLogos</code> dans le code
              </p>
            </>
          )}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl px-4"
          onClick={() => {
            setVideoModalOpen(false);
            setCurrentVideo('');
            setCurrentVideoMeta(null);
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setVideoModalOpen(false);
              setCurrentVideo('');
              setCurrentVideoMeta(null);
            }}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
          >
            <XCircle className="w-6 h-6 text-white" />
          </button>
          <div className="w-full max-w-5xl mx-4" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={currentVideo}
              className="w-full aspect-video rounded-2xl mb-4"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            {currentVideoMeta && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                  {currentVideoMeta.category}
                </p>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                  {currentVideoMeta.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {currentVideoMeta.description}
                </p>
              </div>
            )}
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
