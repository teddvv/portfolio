import { useState, useEffect, useRef } from 'react';
import {
  Github, Linkedin, Mail, Download, Send, MapPin,
  ArrowUpRight, ArrowDown,
} from 'lucide-react';

/* ============================================================
 * ASSETS — paths resolved through Vite's BASE_URL
 * ============================================================ */
const B = import.meta.env.BASE_URL;

const IMG = {
  photo:        `${B}photo-pro.jpg`,
  tardis1:      `${B}projects/tardis-1.jpg`,
  tardis2:      `${B}projects/tardis-2.jpg`,
  bracketbot1:  `${B}projects/bracketbot-1.jpg`,
  bracketbot2:  `${B}projects/bracketbot-2.jpg`,
  nextbuy1:     `${B}projects/nextbuy-1.jpg`,
  nextbuy2:     `${B}projects/nextbuy-2.jpg`,
  nextbuy3:     `${B}projects/nextbuy-3.jpg`,
};

const CV_URL        = `${B}cv-teddy-pategou.pdf`;
const CONTACT_EMAIL = 'teddypat.pro@gmail.com';

/* ============================================================
 * CONTENT — all the text in one place, easy to edit
 * ============================================================ */

const NAV_ITEMS = [
  { id: 'about',     label: 'À propos' },
  { id: 'work',      label: 'Projets' },
  { id: 'journey',   label: 'Parcours' },
  { id: 'interests', label: 'Au-delà' },
  { id: 'contact',   label: 'Contact' },
];

// Used by the Nav for scroll-spy (must include hero + all section ids)
const SECTION_IDS = ['hero', 'about', 'work', 'quote', 'journey', 'beyond', 'interests', 'contact'];

const STATS = [
  { num: '3',  label: 'Projets majeurs' },
  { num: '6+', label: 'Technos maîtrisées' },
  { num: 'C1', label: 'Anglais' },
];

const PROJECTS = [
  {
    id: 'tardis',
    title: 'TARDIS',
    date: 'Février 2026',
    category: 'Data · ML',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'Streamlit'],
    lead: "Mission menée pour le service d'analyse de données de la SNCF. Analyse de l'historique des retards de trains, identification de patterns récurrents et développement d'un modèle de Machine Learning capable de **prédire les retards futurs**.",
    detail: "Le projet aboutit à un dashboard interactif Streamlit permettant de visualiser les statistiques de trafic et d'estimer le retard potentiel d'un trajet.",
  },
  {
    id: 'bracketbot',
    title: 'BracketBot',
    date: 'Avril 2026',
    category: 'IA · SaaS',
    tags: ['Python', 'Discord API', 'Challonge API', 'NLP'],
    lead: "Agent conversationnel IA dédié à la gestion de tournois esport. Automatise l'organisation, traite les interactions joueurs et construit un outil Discord **scalable** capable de gérer n'importe quelle compétition.",
    detail: "Inscriptions, génération d'arbres de tournoi via API externes, extraction des scores en langage naturel, suivi temps réel — un produit SaaS B2B fonctionnel.",
  },
  {
    id: 'nextbuy',
    title: 'NextBuy',
    date: 'Mars 2026',
    category: 'Data · ML',
    tags: ['Python', 'Pandas', 'Seaborn', 'Scikit-learn', 'Jupyter'],
    lead: "Analyse de données basée sur des commandes alimentaires réelles de **milliers de clients**. Exploration des datasets, extraction d'insights business actionnables et développement de modèles ML capables de prédire le comportement client.",
    detail: "Notebook Jupyter complet combinant Exploratory Data Analysis, visualisations et modélisation prédictive (Logistic Regression, Random Forest).",
  },
];

const JOURNEY = [
  {
    num: '01',
    title: 'Programmation & Data Science',
    desc: "Python est devenu mon terrain de jeu : passer de la théorie à la pratique en construisant de vrais modèles d'analyse et des outils de prédiction concrets.",
  },
  {
    num: '02',
    title: 'Conception UI/UX',
    desc: "J'ai appris à penser le développement par l'usage. Figma comme atelier de prototypage avant même la première ligne de code.",
  },
  {
    num: '03',
    title: 'Discipline & équipe',
    desc: "Au-delà de Git, j'ai surtout appris à structurer mes journées et à collaborer efficacement en binôme pour mener à bien des projets exigeants.",
  },
];

const INTERESTS = [
  {
    emoji: '🎮',
    label: 'Gaming',
    title: 'Jeux vidéo',
    desc: "Les jeux comme moyen de décompresser, de la stratégie au pur fun entre amis.",
    gradient: 'from-orange-500 via-rose-600 to-purple-700',
    glow: 'circle at 30% 20%, rgba(255,255,255,0.2), transparent 60%',
  },
  {
    emoji: '🎬',
    label: 'Cinéma · Letterboxd',
    title: 'Films et séries',
    desc: "Du blockbuster au film d'auteur, je tiens mon journal cinéma sur Letterboxd. Voir mon profil →",
    gradient: 'from-neutral-900 via-zinc-900 to-stone-800',
    glow: 'circle at 70% 30%, rgba(220,38,38,0.25), transparent 60%',
    href: 'https://boxd.it/hBkDb',
  },
  {
    emoji: '🏀',
    label: 'Sport',
    title: 'Basket-ball',
    desc: "Sur le terrain comme dans le code : esprit d'équipe, anticipation et exécution.",
    gradient: 'from-amber-500 via-orange-600 to-red-700',
    glow: 'circle at 30% 30%, rgba(255,255,255,0.25), transparent 60%',
  },
];

/* ============================================================
 * UTILS — small helpers
 * ============================================================ */

// Smooth scroll to a section by id
const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

// Render text with **bold** markers replaced by a <span>
// e.g. "hello **world**" → ["hello ", <span>world</span>]
const md = (text, boldClass = 'font-medium') =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 0
      ? part
      : <span key={i} className={boldClass}>{part}</span>
  );

/* ============================================================
 * ANIMATIONS — scroll-triggered fade-in
 * ============================================================ */

function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.15, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function Reveal({ children, delay = 0, y = 40, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
 * UI PRIMITIVES — small reusable visual bits
 * ============================================================ */

// Small uppercase eyebrow label sitting above section titles
function Eyebrow({ children, color = 'text-neutral-500' }) {
  return (
    <div className={`text-[11px] tracking-[0.2em] uppercase font-medium mb-4 ${color}`}>
      {children}
    </div>
  );
}

// Tech tag pill (used inside project cards)
function TechTag({ children, dark = false }) {
  const styles = dark
    ? 'border-blue-400/30 text-blue-200'
    : 'border-neutral-300 text-neutral-600';
  return (
    <span className={`text-xs font-medium px-3 py-1 border rounded-full ${styles}`}>
      {children}
    </span>
  );
}

// Stat block: big number + small label (used in the About section)
function Stat({ num, label }) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-bold tracking-tightest">{num}</div>
      <div className="text-[11px] uppercase tracking-wider text-neutral-500 mt-2 font-medium">
        {label}
      </div>
    </div>
  );
}

// Project header: date · category
function ProjectMeta({ date, category, dark = false }) {
  return (
    <div className={`flex items-center gap-3 text-xs tracking-widest uppercase font-medium mb-4 ${
      dark ? 'text-blue-300' : 'text-neutral-500'
    }`}>
      <span>{date}</span>
      <span className={`h-px w-6 ${dark ? 'bg-blue-400' : 'bg-neutral-400'}`} />
      <span>{category}</span>
    </div>
  );
}

// Form input field (used in the contact form)
function FormField({ label, type = 'text', value, onChange, multiline = false }) {
  const base = 'w-full bg-transparent border-b border-neutral-700 focus:border-blue-400 outline-none py-3 text-lg transition-colors';
  return (
    <div>
      <label className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 font-medium block mb-3">
        {label}
      </label>
      {multiline
        ? <textarea rows={5} required value={value} onChange={onChange} className={`${base} resize-none`} />
        : <input type={type} required value={value} onChange={onChange} className={base} />
      }
    </div>
  );
}

// Contact link row: icon + text, optionally external
function ContactLink({ icon: Icon, href, external, children }) {
  const linkProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <a href={href} {...linkProps} className="flex items-center gap-4 text-neutral-300 hover:text-white transition group">
      <Icon className="w-5 h-5 text-blue-400" />
      <span className="group-hover:underline underline-offset-4">{children}</span>
    </a>
  );
}

/* ============================================================
 * SECTIONS
 * ============================================================ */

// --- Nav: sticky top bar with scroll-spy ---
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');

  // Frosted background once scrolled past the top
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the nav item matching the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0.4 }
    );
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/80 backdrop-blur-xl py-3 border-b border-neutral-200/60'
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

        {/* Brand */}
        <button onClick={() => scrollTo('hero')} className="text-base font-semibold tracking-tight hover:opacity-60 transition">
          Teddy <span className="text-blue-600">Pategou</span>
        </button>

        {/* Links */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`text-[13px] font-medium tracking-wide transition-all ${
                active === item.id ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollTo('contact')}
          className="text-[13px] font-medium bg-neutral-900 hover:bg-blue-600 text-white transition-all duration-300 px-4 py-2 rounded-full"
        >
          Discutons
        </button>
      </div>
    </nav>
  );
}

// --- Hero: full-screen catchphrase + intro paragraph ---
function Hero() {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-16 max-w-7xl mx-auto">

      <Reveal delay={100}>
        <div className="flex items-center gap-3 mb-10 text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-medium">
          <span className="h-px w-10 bg-neutral-400" />
          Bachelor Epitech — Promo 2028 · Strasbourg
        </div>
      </Reveal>

      <Reveal delay={200}>
        <h1
          className="font-extrabold tracking-tightest leading-[0.9] text-balance"
          style={{ fontSize: 'clamp(3.5rem, 11vw, 11rem)' }}
        >
          La complexité,<br />
          <span className="text-blue-600">simplifiée</span>.
        </h1>
      </Reveal>

      <Reveal delay={400}>
        <div className="mt-12 md:mt-16 grid md:grid-cols-12 gap-8 items-end">
          <p className="md:col-span-7 text-xl md:text-2xl text-neutral-600 font-light leading-snug max-w-2xl">
            Étudiant en développement à Epitech Strasbourg, passionné par le{' '}
            <span className="text-neutral-900 font-medium">frontend</span> et le{' '}
            <span className="text-neutral-900 font-medium">design</span>.
            Je construis avec rigueur, et sans prise de tête.
          </p>
          <div className="md:col-span-5 flex md:justify-end">
            <button
              onClick={() => scrollTo('about')}
              className="flex items-center gap-2 text-sm text-neutral-500 bounce-soft hover:text-neutral-900 transition"
            >
              <ArrowDown className="w-4 h-4" />
              Découvrir
            </button>
          </div>
        </div>
      </Reveal>

    </section>
  );
}

// --- About: photo + bio + stats ---
function About() {
  return (
    <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">

        {/* Photo */}
        <Reveal className="md:col-span-5">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700">
            <img src={IMG.photo} alt="Teddy Pategou" className="w-full h-full object-cover" />
          </div>
        </Reveal>

        {/* Text */}
        <div className="md:col-span-7">
          <Reveal delay={100}><Eyebrow>À propos</Eyebrow></Reveal>

          <Reveal delay={200}>
            <h2 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tightest mb-10 text-balance">
              Un parcours qui<br />
              n'avait <span className="text-blue-600">rien d'évident</span>.
            </h2>
          </Reveal>

          <Reveal delay={300}>
            <div className="space-y-5 text-lg text-neutral-700 max-w-xl leading-relaxed">
              <p>
                Après un bac STI2D, j'ai d'abord cherché ma voie en faculté de langues
                avant de la quitter pour enchaîner plusieurs jobs.
              </p>
              <p>
                C'est cette envie de <span className="text-neutral-900 font-medium">tout changer</span>{' '}
                et de construire des choses concrètes qui m'a conduit chez Epitech,
                où j'ai enfin trouvé ce qui me parle vraiment : faire du{' '}
                <span className="text-neutral-900 font-medium">frontend</span> et du{' '}
                <span className="text-neutral-900 font-medium">design</span> qui ont du sens.
              </p>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-12 grid grid-cols-3 gap-6 md:gap-10 max-w-md">
              {STATS.map(s => <Stat key={s.label} {...s} />)}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// --- Project: TARDIS layout (light, hero image + secondary image below) ---
function ProjectTardis({ p }) {
  return (
    <Reveal>
      <div className="mb-32">
        <div className="grid md:grid-cols-12 gap-8 mb-10">
          <div className="md:col-span-5">
            <ProjectMeta date={p.date} category={p.category} />
            <h3 className="text-5xl md:text-6xl font-bold tracking-tightest leading-none mb-6">{p.title}</h3>
            <p className="text-lg text-neutral-700 leading-relaxed mb-6">
              {md(p.lead, 'text-neutral-900 font-medium')}
            </p>
            <p className="text-base text-neutral-600 leading-relaxed mb-6">{p.detail}</p>
            <div className="flex flex-wrap gap-2">
              {p.tags.map(t => <TechTag key={t}>{t}</TechTag>)}
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl shadow-blue-900/10">
              <img src={IMG.tardis1} alt="TARDIS dashboard" className="w-full" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden bg-neutral-900 max-w-3xl mx-auto shadow-xl">
          <img src={IMG.tardis2} alt="TARDIS notebook" className="w-full" />
        </div>
      </div>
    </Reveal>
  );
}

// --- Project: BracketBot layout (dark card with side-by-side images) ---
function ProjectBracketBot({ p }) {
  return (
    <Reveal>
      <div className="mb-32 bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 rounded-3xl p-10 md:p-16 text-white">
        <div className="grid md:grid-cols-12 gap-8 items-center">

          <div className="md:col-span-5 md:order-2">
            <ProjectMeta date={p.date} category={p.category} dark />
            <h3 className="text-5xl md:text-6xl font-bold tracking-tightest leading-none mb-6">{p.title}</h3>
            <p className="text-lg text-blue-100 leading-relaxed mb-6">
              {md(p.lead, 'text-white font-medium')}
            </p>
            <p className="text-base text-blue-200/80 leading-relaxed mb-6">{p.detail}</p>
            <div className="flex flex-wrap gap-2">
              {p.tags.map(t => <TechTag key={t} dark>{t}</TechTag>)}
            </div>
          </div>

          <div className="md:col-span-7 md:order-1 grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden bg-neutral-950 border border-white/10">
              <img src={IMG.bracketbot1} alt="BracketBot profile" className="w-full" />
            </div>
            <div className="rounded-2xl overflow-hidden bg-neutral-950 border border-white/10 mt-8">
              <img src={IMG.bracketbot2} alt="BracketBot usage" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// --- Project: NextBuy layout (hero image + 2-column grid below) ---
function ProjectNextBuy({ p }) {
  return (
    <Reveal>
      <div>
        <div className="grid md:grid-cols-12 gap-8 mb-10">
          <div className="md:col-span-5">
            <ProjectMeta date={p.date} category={p.category} />
            <h3 className="text-5xl md:text-6xl font-bold tracking-tightest leading-none mb-6">{p.title}</h3>
            <p className="text-lg text-neutral-700 leading-relaxed mb-6">
              {md(p.lead, 'text-neutral-900 font-medium')}
            </p>
            <p className="text-base text-neutral-600 leading-relaxed mb-6">{p.detail}</p>
            <div className="flex flex-wrap gap-2">
              {p.tags.map(t => <TechTag key={t}>{t}</TechTag>)}
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl">
              <img src={IMG.nextbuy1} alt="NextBuy notebook" className="w-full" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden bg-neutral-900 shadow-xl">
            <img src={IMG.nextbuy2} alt="NextBuy visualisations" className="w-full" />
          </div>
          <div className="rounded-2xl overflow-hidden bg-neutral-900 shadow-xl">
            <img src={IMG.nextbuy3} alt="NextBuy ML models" className="w-full" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// Map each project id to its custom layout component
const PROJECT_LAYOUTS = {
  tardis:     ProjectTardis,
  bracketbot: ProjectBracketBot,
  nextbuy:    ProjectNextBuy,
};

// --- Work: heading + list of projects ---
function Work() {
  return (
    <section id="work" className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        <Reveal>
          <div className="flex items-end justify-between mb-20 gap-8">
            <div>
              <Eyebrow>Sélection</Eyebrow>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tightest leading-none">
                Projets <span className="text-blue-600">2026</span>.
              </h2>
            </div>
            <p className="hidden md:block text-sm text-neutral-500 max-w-xs text-right leading-relaxed">
              Trois projets pour explorer la data science, l'IA conversationnelle
              et le ML appliqué — tous en Python.
            </p>
          </div>
        </Reveal>

        {PROJECTS.map(p => {
          const Layout = PROJECT_LAYOUTS[p.id];
          return <Layout key={p.id} p={p} />;
        })}

      </div>
    </section>
  );
}

// --- Quote: big inspirational quote on a blue gradient ---
function Quote() {
  return (
    <section id="quote" className="py-40 px-6 md:px-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white gradient-shift">
      <div className="max-w-5xl mx-auto text-center">
        <Reveal delay={100}>
          <Eyebrow color="text-blue-200">Ce qui me guide</Eyebrow>
        </Reveal>
        <Reveal delay={200} y={20}>
          <blockquote className="text-3xl md:text-5xl lg:text-6xl font-light leading-[1.15] tracking-tight text-balance">
            « Il n'est jamais trop tard pour devenir<br className="hidden md:block" />{' '}
            <span className="font-semibold">ce que nous aurions pu être</span>. »
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

// --- Journey: 3 learning cards ---
function Journey() {
  return (
    <section id="journey" className="py-32 px-6 md:px-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <Reveal><Eyebrow>Ce que j'ai appris</Eyebrow></Reveal>
        <Reveal delay={150}>
          <h2 className="text-5xl md:text-7xl font-bold leading-[0.95] tracking-tightest mb-20 max-w-4xl text-balance">
            Apprendre, c'est <span className="text-blue-600">itérer</span> sans s'arrêter.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {JOURNEY.map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <div className="bg-white rounded-3xl p-8 md:p-10 h-full border border-neutral-200/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                <div className="text-blue-600 text-sm font-mono mb-6">{c.num}</div>
                <h3 className="text-2xl font-bold tracking-tight mb-4 leading-tight">{c.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Beyond: experiences outside school ---
function Beyond() {
  return (
    <section id="beyond" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <Reveal><Eyebrow>Au-delà du code</Eyebrow></Reveal>
      <Reveal delay={150}>
        <h2 className="text-5xl md:text-7xl font-bold leading-none tracking-tightest mb-16 max-w-3xl text-balance">
          Expériences & engagements.
        </h2>
      </Reveal>

      <Reveal delay={250}>
        <div className="group relative bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-3xl p-10 md:p-16 overflow-hidden cursor-pointer hover:scale-[0.99] transition-transform duration-500">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="text-sm tracking-widest uppercase text-blue-300 font-medium mb-4">
                2026 · Visiteur
              </div>
              <h3 className="text-4xl md:text-6xl font-bold tracking-tightest leading-none mb-6">
                Epitech Summit 2026
              </h3>
              <p className="text-lg text-neutral-300 leading-relaxed">
                Présent en tant que visiteur au sommet annuel d'Epitech — un rendez-vous
                incontournable pour découvrir les dernières tendances tech, échanger
                avec des pros du secteur et rencontrer la communauté étudiante de toutes
                les villes.
              </p>
            </div>
            <ArrowUpRight className="w-10 h-10 opacity-60 group-hover:opacity-100 group-hover:rotate-45 transition-all" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// --- Interests: 3 colorful tiles ---
function InterestCard({ item, delay }) {
  const baseCls = `group aspect-[4/5] rounded-3xl p-8 flex flex-col justify-between text-white overflow-hidden relative bg-gradient-to-br ${item.gradient} hover:scale-[1.02] transition-transform duration-500`;

  // Same content in either a link wrapper or a plain div
  const content = (
    <>
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(${item.glow})` }}
      />
      <div className="text-5xl relative leading-none">{item.emoji}</div>
      <div className="relative">
        <div className="text-xs tracking-widest uppercase opacity-70 mb-2">{item.label}</div>
        <h3 className="text-3xl font-bold tracking-tightest leading-none mb-3">{item.title}</h3>
        <p className="text-sm opacity-80 leading-relaxed">{item.desc}</p>
      </div>
    </>
  );

  return (
    <Reveal delay={delay}>
      {item.href
        ? <a href={item.href} target="_blank" rel="noopener noreferrer" className={`${baseCls} cursor-pointer`}>{content}</a>
        : <div className={`${baseCls} cursor-default`}>{content}</div>
      }
    </Reveal>
  );
}

function Interests() {
  return (
    <section id="interests" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <Reveal><Eyebrow>En dehors de l'écran</Eyebrow></Reveal>
      <Reveal delay={150}>
        <h2 className="text-5xl md:text-7xl font-bold leading-none tracking-tightest mb-16 max-w-3xl text-balance">
          Centres d'<span className="text-blue-600">intérêt</span>.
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6">
        {INTERESTS.map((item, i) => (
          <InterestCard key={item.title} item={item} delay={100 + i * 100} />
        ))}
      </div>
    </section>
  );
}

// --- Contact: details (left) + form (right) ---
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact depuis le portfolio — ${form.name}`);
    const body = encodeURIComponent(`De : ${form.name} <${form.email}>\n\n${form.message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-32 px-6 md:px-12 bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-16">

        {/* Left: contact details */}
        <div className="md:col-span-6">
          <Reveal><Eyebrow color="text-neutral-400">Contact</Eyebrow></Reveal>
          <Reveal delay={150}>
            <h2 className="text-5xl md:text-7xl font-bold leading-none tracking-tightest mb-10 text-balance">
              On en <span className="text-blue-400">discute</span> ?
            </h2>
          </Reveal>
          <Reveal delay={250}>
            <p className="text-neutral-400 text-lg leading-relaxed mb-12 max-w-md">
              Développeur et Designer polyvalent. Je recherche des opportunités pour contribuer à des projets stimulants. Disponible pour toute discussion technique, collaborative
            </p>
          </Reveal>

          <Reveal delay={350}>
            <div className="space-y-4 mb-10">
              <ContactLink icon={Mail}     href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</ContactLink>
              <ContactLink icon={Linkedin} href="https://www.linkedin.com/in/teddy-trevor-pategou/" external>
                linkedin.com/in/teddy-trevor-pategou
              </ContactLink>
              <ContactLink icon={Github}   href="https://github.com/teddvv" external>
                github.com/teddvv
              </ContactLink>
              <div className="flex items-center gap-4 text-neutral-300">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>Strasbourg, France</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={500}>
            <a
              href={CV_URL}
              download
              className="inline-flex items-center gap-3 bg-white text-neutral-900 hover:bg-blue-500 hover:text-white transition-all duration-300 px-6 py-3 rounded-full font-medium"
            >
              <Download className="w-4 h-4" />
              Télécharger mon CV
            </a>
          </Reveal>
        </div>

        {/* Right: contact form */}
        <div className="md:col-span-6">
          <Reveal delay={300}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <FormField label="Votre nom" value={form.name}    onChange={update('name')} />
              <FormField label="Email" type="email" value={form.email} onChange={update('email')} />
              <FormField label="Message" multiline value={form.message} onChange={update('message')} />
              <button
                type="submit"
                className="flex items-center gap-3 bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-full font-medium transition-colors"
              >
                Envoyer le message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </Reveal>
        </div>

      </div>
    </section>
  );
}

// --- Footer ---
function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-500 border-t border-neutral-900 py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div>© 2026 Teddy Pategou</div>
        <div className="text-neutral-600">Epitech Strasbourg · Promo 2028</div>
      </div>
    </footer>
  );
}

/* ============================================================
 * APP — composes all sections
 * ============================================================ */
export default function App() {
  return (
    <div className="bg-white text-neutral-900 antialiased overflow-x-hidden">
      <Nav />
      <Hero />
      <About />
      <Work />
      <Quote />
      <Journey />
      <Beyond />
      <Interests />
      <Contact />
      <Footer />
    </div>
  );
}
