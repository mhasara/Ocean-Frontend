import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Fish,
  Menu,
  Search,
  Waves,
} from "lucide-react";
import jellyfishBlue from "./img/image.png";
import jellyfishRed from "./img/istockphoto-1396795036-2048x2048.jpg";
import jellyfishBackground from "./img/neon-jellyfish-background.avif";
import jellyfishNeon from "./img/neon-jellyfish-in-deep-ocean-photo.jpeg";

const navItems = ["Home", "Discover", "Photos", "Fish", "Contact"];

const cards = [
  {
    number: "01",
    title: "Coral Bloom",
    text: "Follow neon reefs, pulsing plankton, and the quiet life hidden in midnight blue currents.",
    image: jellyfishBackground,
    swapImage: jellyfishNeon,
    accent: "amber",
    active: true,
  },
  {
    number: "02",
    title: "Aurelia Drift",
    image: jellyfishBlue,
    swapImage: jellyfishBackground,
    accent: "cyan",
  },
  {
    number: "03",
    title: "Blue Abyss",
    image: jellyfishRed,
    swapImage: jellyfishBlue,
    accent: "violet",
  },
  {
    number: "04",
    title: "Pink Lantern",
    image: jellyfishNeon,
    swapImage: jellyfishRed,
    accent: "pink",
  },
];

function FerrofluidBackground() {
  return (
    <div className="ferrofluid-bg" aria-hidden="true">
      <div className="ferrofluid-field">
        <span className="ferro-blob ferro-blob-one" />
        <span className="ferro-blob ferro-blob-two" />
        <span className="ferro-blob ferro-blob-three" />
        <span className="ferro-blob ferro-blob-four" />
        <span className="ferro-blob ferro-blob-five" />
      </div>
    </div>
  );
}

function FishLogo() {
  return (
    <a href="#home" className="group flex items-center gap-3" aria-label="Sea Wonders home">
      <span className="grid size-10 place-items-center rounded-full border border-cyan-200/20 bg-cyan-100/5 text-[#c9f7ff] shadow-[0_0_24px_rgba(34,211,238,0.18)] backdrop-blur-md transition group-hover:border-cyan-200/50 group-hover:text-[#f0fdff]">
        <Fish size={23} strokeWidth={1.8} />
      </span>
    </a>
  );
}

function SocialSidebar() {
  return (
    <div className="social-sidebar" aria-label="Social links">
      <a href="#facebook" aria-label="Facebook">
        f
      </a>
      <a href="#instagram" aria-label="Instagram">
        <Camera size={15} strokeWidth={1.7} />
      </a>
      <a href="#twitter" aria-label="Twitter">
        t
      </a>
    </div>
  );
}

function HeroJellyfish() {
  return (
    <div className="pointer-events-none absolute inset-y-16 right-[-12vw] z-10 hidden w-[68vw] max-w-[980px] lg:block">
      <div className="jellyfish-aura" />
      <img
        className="main-jellyfish"
        src={jellyfishBackground}
        alt=""
        aria-hidden="true"
      />
      <div className="tentacle-glow tentacle-glow-one" />
      <div className="tentacle-glow tentacle-glow-two" />
    </div>
  );
}

function CreatureCard({ card }) {
  if (card.active) {
    return (
      <article className={`active-card motion-card card-${card.accent} group`}>
        <img className="card-image card-image-base" src={card.image} alt="" />
        <img className="card-image card-image-swap" src={card.swapImage} alt="" />
        <span className="card-scan" />
        <span className="card-rim" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020816]/92 via-[#020816]/56 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <span className="card-number text-orange-300">{card.number}</span>
          <h2 className="mt-5 text-xl font-extrabold uppercase text-[#d8f7ff]">Deep Reef Pulse</h2>
          <p className="mt-2 max-w-[19rem] text-sm leading-6 text-[#b7d6e8]/75">{card.text}</p>
        </div>
      </article>
    );
  }

  return (
    <article className={`inactive-card motion-card card-${card.accent} group`}>
      <img className="card-image card-image-base" src={card.image} alt="" />
      <img className="card-image card-image-swap" src={card.swapImage} alt="" />
      <span className="card-scan" />
      <span className="card-rim" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020816]/82 via-transparent to-transparent" />
      <span className="card-number absolute left-4 top-4 text-[#d8f7ff]/86">{card.number}</span>
      <p className="absolute bottom-4 left-4 right-4 text-xs font-bold uppercase tracking-[0.12em] text-[#c7e9f6]/80">
        {card.title}
      </p>
    </article>
  );
}

function App() {
  return (
    <main
      id="home"
      className="relative min-h-screen overflow-hidden bg-black text-[#d8ecff]"
    >
      <FerrofluidBackground />
      <div className="water-overlay" />
      <div className="surface-glass" />
      <div className="plankton-field" />
      <SocialSidebar />

      <header className="relative z-40 mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-9">
          <FishLogo />
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                className="text-sm font-medium text-[#b8d8ea]/62 transition hover:text-[#f3fbff]"
                href={`#${item.toLowerCase()}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-5 text-[#d8ecff]">
          <button className="nav-icon" aria-label="Search">
            <Search size={22} strokeWidth={1.65} />
          </button>
          <button className="hamburger" aria-label="Open menu">
            <Menu size={28} strokeWidth={1.55} />
          </button>
        </div>
      </header>

      <HeroJellyfish />

      <section className="relative z-30 mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-[1440px] flex-col justify-between px-5 pb-6 pt-8 sm:px-8 lg:px-12 lg:pb-10">
        <div className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1fr)]">
          <div className="max-w-[780px] lg:pl-12">
            <p className="mb-5 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.36em] text-[#74e8ff]/78">
              <Waves size={18} strokeWidth={1.8} />
              Abyssal journal
            </p>
            <h1 className="max-w-[13ch] text-[clamp(3.4rem,8.4vw,8.8rem)] font-bold uppercase leading-[0.88] text-[#d8f7ff]/92 drop-shadow-[0_12px_34px_rgba(0,0,0,0.26)]">
              Discover all the sea wonders
            </h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-[#b7d6e8]/70 sm:text-lg">
              Dive through glowing habitats, rare sea life, and cinematic reef trails shaped by
              bioluminescent color, quiet motion, and the pressure-dark beauty of the deep.
            </p>
          </div>
        </div>

        <div className="relative z-40 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="cards-strip">
            {cards.map((card) => (
              <CreatureCard card={card} key={card.number} />
            ))}
          </div>

          <div className="controls-panel">
            <div className="slider-index" aria-label="Slide 1 of 6">
              <span>01</span>
              <span className="slider-line" />
              <span>06</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="round-control" aria-label="Previous slide">
                <ArrowLeft size={18} />
              </button>
              <button className="round-control" aria-label="Next slide">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="edge-pagination" aria-hidden="true">
        <span className="active" />
        <span />
        <span />
        <span />
      </div>
    </main>
  );
}

export default App;
