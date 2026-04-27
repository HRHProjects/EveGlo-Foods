import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Leaf,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  X
} from 'lucide-react';
import { departments, highlights, products, testimonials } from './productData.js';

const heroSlides = [
  {
    label: 'Launch lineup',
    title: 'Shirataki rice, noodles, and pasta in one clean pantry range.',
    text: 'The new EveGlo product mockup anchors the storefront hero with real packaging photography.',
    image: '/assets/product-mockup1.png',
    alt: 'EveGlo Foods shirataki rice, noodles, and spaghetti product packaging displayed on a kitchen counter',
    focus: 'center'
  },
  {
    label: 'Low-carb meals',
    title: 'Rice and noodle staples for fast weeknight cooking.',
    text: 'Slide through the range before browsing the full collection below.',
    image: '/assets/product-mockup1.png',
    alt: 'EveGlo Foods rice and noodle product lineup',
    focus: 'left center'
  },
  {
    label: 'Retail ready',
    title: 'Shelf-ready packaging for online and wholesale buyers.',
    text: 'A premium first impression for shoppers, retailers, and distributors.',
    image: '/assets/product-mockup1.png',
    alt: 'EveGlo Foods retail product boxes and pouches',
    focus: 'right center'
  }
];

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="announcement">
        <span>FREE shipping over $70</span>
        <span>Canada-wide pantry delivery</span>
        <span>Wholesale enquiries open</span>
      </div>

      <nav className="navbar" aria-label="Main navigation">
        <a href="#home" className="brand" aria-label="EveGlo Foods home">
          <img src="/assets/eveglo-logo.png" alt="EveGlo Foods" />
        </a>

        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`nav-links ${open ? 'is-open' : ''}`}>
          {departments.map((department) => (
            <a href="#shop" key={department}>{department}</a>
          ))}
        </div>

        <div className="nav-actions">
          <button aria-label="Search"><Search size={19} /></button>
          <button aria-label="Cart"><ShoppingBag size={19} /></button>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <p className="eyebrow"><Leaf size={16} /> Plant-forward pantry essentials</p>
        <h1>Clean comfort foods for modern low-carb kitchens.</h1>
        <p className="hero-text">
          EveGlo Foods brings low-carb pasta, shirataki rice, and high-protein pantry staples into a polished Canadian grocery experience built for retail, online orders, and wholesale growth.
        </p>
        <div className="hero-actions">
          <a href="#shop" className="primary-button">Shop collection <ArrowRight size={18} /></a>
          <a href="#wholesale" className="secondary-button">Wholesale inquiry</a>
        </div>
        <div className="trust-row">
          <span><Check size={16} /> Low carb options</span>
          <span><Check size={16} /> Plant-based range</span>
          <span><Check size={16} /> Fast prep meals</span>
        </div>
      </div>

      <div className="hero-gallery" aria-label="EveGlo product gallery">
        <div className="gallery-frame">
          {heroSlides.map((slide, index) => (
            <figure
              className={`gallery-slide ${activeSlide === index ? 'is-active' : ''}`}
              key={slide.label}
              aria-hidden={activeSlide !== index}
            >
              <img
                src={slide.image}
                alt={activeSlide === index ? slide.alt : ''}
                style={{ objectPosition: slide.focus }}
              />
              <figcaption>
                <span>{slide.label}</span>
                <strong>{slide.title}</strong>
                <small>{slide.text}</small>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="gallery-controls" aria-label="Choose hero gallery slide">
          {heroSlides.map((slide, index) => (
            <button
              type="button"
              key={slide.label}
              className={activeSlide === index ? 'active' : ''}
              onClick={() => setActiveSlide(index)}
              aria-label={`Show ${slide.label} slide`}
              aria-pressed={activeSlide === index}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryStrip() {
  return (
    <section className="category-strip" aria-label="Product categories">
      {departments.slice(0, 4).map((item) => (
        <a href="#shop" className="category-pill" key={item}>
          <span>{item}</span>
          <ArrowRight size={16} />
        </a>
      ))}
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <article className={`product-card accent-${product.accent}`}>
      <div className="product-image">
        <div className="pack-front">
          <span>EveGlo</span>
          <strong>{product.tag}</strong>
        </div>
      </div>
      <div className="product-info">
        <div className="product-meta">
          <span>{product.badge}</span>
          <span>{product.size}</span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.price}</p>
        <button>Choose options</button>
      </div>
    </article>
  );
}

function FeaturedCollection() {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Low carb', 'High protein', 'Rice', 'Pasta'];

  const visibleProducts = useMemo(() => {
    if (filter === 'All') return products;
    const value = filter.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(value) || product.tag.toLowerCase().includes(value)
    );
  }, [filter]);

  return (
    <section className="collection" id="shop">
      <div className="section-heading">
        <p className="eyebrow"><Sparkles size={16} /> Featured collection</p>
        <h2>Guilt-free pasta and rice, positioned for premium shelves.</h2>
        <p>
          Placeholder products are structured for a health-food ecommerce flow: product cards, options, price ranges, quick categories, and room for future product photography.
        </p>
      </div>

      <div className="filter-row" aria-label="Filter products">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={filter === item ? 'active' : ''}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
}

function PromoBand() {
  return (
    <section className="promo-band">
      <div>
        <p className="eyebrow"><Truck size={16} /> Retail ready</p>
        <h2>Built for ecommerce now and grocery expansion later.</h2>
      </div>
      <div className="promo-copy">
        <p>
          Add product photos, Shopify links, wholesale forms, nutrition panels, recipe pages, and distributor information without rebuilding the site structure.
        </p>
        <a href="#wholesale">Start wholesale conversation <ArrowRight size={17} /></a>
      </div>
    </section>
  );
}

function Highlights() {
  return (
    <section className="highlights" id="story">
      {highlights.map((item, index) => (
        <article key={item.title}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </section>
  );
}

function Testimonials() {
  return (
    <section className="testimonials">
      <div className="section-heading compact">
        <p className="eyebrow">Customer notes</p>
        <h2>Designed to make the product feel credible before photography is ready.</h2>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((quote) => (
          <blockquote key={quote}>“{quote}”</blockquote>
        ))}
      </div>
    </section>
  );
}

function Wholesale() {
  return (
    <section className="wholesale" id="wholesale">
      <div>
        <p className="eyebrow">Wholesale and retail</p>
        <h2>Carry EveGlo Foods in your store.</h2>
        <p>
          Use this section for a contact form, downloadable line sheet, wholesale pricing, distributor notes, or a direct email link.
        </p>
      </div>
      <form className="lead-form">
        <input type="text" placeholder="Store or buyer name" aria-label="Store or buyer name" />
        <input type="email" placeholder="Email address" aria-label="Email address" />
        <select aria-label="Inquiry type" defaultValue="">
          <option value="" disabled>Inquiry type</option>
          <option>Retail buyer</option>
          <option>Distributor</option>
          <option>Restaurant or food service</option>
        </select>
        <button type="button">Request line sheet</button>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <img src="/assets/eveglo-logo.png" alt="EveGlo Foods" />
        <p>Modern low-carb, plant-forward pantry staples.</p>
      </div>
      <div>
        <h4>Shop</h4>
        <a href="#shop">Low Carb Pasta</a>
        <a href="#shop">Shirataki Rice</a>
        <a href="#shop">High Protein Pasta</a>
      </div>
      <div>
        <h4>Company</h4>
        <a href="#story">Our Story</a>
        <a href="#wholesale">Wholesale</a>
        <a href="mailto:hello@eveglofoods.ca">Contact</a>
      </div>
      <div>
        <h4>Updates</h4>
        <p>Product launch, recipes, retail availability, and pantry notes.</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <CategoryStrip />
        <FeaturedCollection />
        <PromoBand />
        <Highlights />
        <Testimonials />
        <Wholesale />
      </main>
      <Footer />
    </div>
  );
}
