import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Leaf,
  Mail,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X
} from 'lucide-react';
import { departments, highlights, products, testimonials } from './productData.js';

const heroSlides = [
  {
    label: 'Collection 01',
    image: '/assets/hero-gallery/collection-mockup-1.png',
    alt: 'EveGlo Foods product collection mockup display',
    focus: 'center'
  },
  {
    label: 'Collection 02',
    image: '/assets/hero-gallery/collection-mockup-2.png',
    alt: 'EveGlo Foods low-carb rice and noodle packaging mockup',
    focus: 'center'
  },
  {
    label: 'Collection 03',
    image: '/assets/hero-gallery/collection-mockup-3.png',
    alt: 'EveGlo Foods product lineup hero mockup',
    focus: 'center'
  },
  {
    label: 'Collection 04',
    image: '/assets/hero-gallery/collection-mockup-4.png',
    alt: 'EveGlo Foods shirataki product packaging mockup',
    focus: 'center'
  },
  {
    label: 'Collection 05',
    image: '/assets/hero-gallery/collection-mockup-5.png',
    alt: 'EveGlo Foods retail product collection mockup',
    focus: 'center'
  }
];

function Header({ navigate }) {
  const [open, setOpen] = useState(false);
  const go = (page, section) => {
    setOpen(false);
    navigate(page, section);
  };

  return (
    <header className="site-header">
      <div className="announcement">
        <span>FREE shipping over $70</span>
        <span>Canada-wide pantry delivery</span>
        <span>Wholesale enquiries open</span>
      </div>

      <nav className="navbar" aria-label="Main navigation">
        <button type="button" className="brand" aria-label="EveGlo Foods home" onClick={() => go('home', 'home')}>
          <img src="/assets/eveglo-logo.png" alt="EveGlo Foods" />
        </button>

        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`nav-links ${open ? 'is-open' : ''}`}>
          {departments.slice(0, 4).map((department) => (
            <button type="button" onClick={() => go('home', 'shop')} key={department}>{department}</button>
          ))}
          <button type="button" onClick={() => go('about')}>About</button>
          <button type="button" onClick={() => go('home', 'wholesale')}>Wholesale</button>
        </div>

        <div className="nav-actions">
          <button aria-label="Search"><Search size={19} /></button>
          <a href="mailto:Info@EveGlofoods.com" aria-label="Contact us"><Mail size={19} /></a>
          <button aria-label="Cart"><ShoppingBag size={19} /></button>
        </div>
      </nav>
    </header>
  );
}

function Hero({ navigate }) {
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
          <button type="button" onClick={() => navigate('home', 'shop')} className="primary-button">Shop collection <ArrowRight size={18} /></button>
          <button type="button" onClick={() => navigate('home', 'wholesale')} className="secondary-button">Wholesale inquiry</button>
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

function CategoryStrip({ navigate }) {
  return (
    <section className="category-strip" aria-label="Product categories">
      {departments.slice(0, 4).map((item) => (
        <button type="button" onClick={() => navigate('home', 'shop')} className="category-pill" key={item}>
          <span>{item}</span>
          <ArrowRight size={16} />
        </button>
      ))}
    </section>
  );
}

function ComingSoon() {
  return (
    <section className="coming-soon" aria-label="Coming soon announcement">
      <p className="eyebrow"><Sparkles size={16} /> Coming soon</p>
      <h2>EveGlo Foods is getting ready to glow up your pantry.</h2>
      <p>
        Our low-carb rice, shirataki noodles, and high-protein pasta lineup is almost ready for launch.
        Fresh product details, ordering, recipes, and wholesale updates are on the way.
      </p>
      <a href="mailto:Info@EveGlofoods.com">Contact us for launch updates <ArrowRight size={17} /></a>
    </section>
  );
}

function ProductCard({ product, onOpenProduct }) {
  return (
    <article className={`product-card accent-${product.accent}`}>
      <button
        type="button"
        className="product-card-link"
        onClick={() => onOpenProduct(product)}
        aria-label={`View details for ${product.name}`}
      >
      <div className="product-image">
        {product.image ? (
          <img className="product-photo" src={product.image} alt={product.imageAlt || product.name} />
        ) : (
          <div className="pack-front">
            <span>EveGlo</span>
            <strong>{product.tag}</strong>
          </div>
        )}
      </div>
      <div className="product-info">
        <div className="product-meta">
          <span>{product.badge}</span>
          <span>{product.size}</span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.price}</p>
        <span className="product-button">View details</span>
      </div>
      </button>
    </article>
  );
}

function FeaturedCollection({ onOpenProduct }) {
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
          <ProductCard key={product.name} product={product} onOpenProduct={onOpenProduct} />
        ))}
      </div>
    </section>
  );
}

function PromoBand({ navigate }) {
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
        <button type="button" onClick={() => navigate('home', 'wholesale')}>Start wholesale conversation <ArrowRight size={17} /></button>
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
          <blockquote key={quote}>"{quote}"</blockquote>
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
          Reach out for launch timing, product availability, wholesale pricing, distributor notes, or line sheet requests.
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
        <a href="mailto:Info@EveGlofoods.com?subject=EveGlo%20Foods%20Wholesale%20Inquiry">Contact us</a>
      </form>
    </section>
  );
}

function ProductDetail({ product, navigate }) {
  if (!product) return null;

  return (
    <section className="detail-page">
      <button type="button" className="back-button" onClick={() => navigate('home', 'shop')}>
        <ArrowRight size={17} /> Back to collection
      </button>
      <div className="detail-layout">
        <div className={`detail-pack accent-${product.accent}`}>
          {product.image ? (
            <img className="detail-photo" src={product.image} alt={product.imageAlt || product.name} />
          ) : (
            <div className="pack-front">
              <span>EveGlo</span>
              <strong>{product.tag}</strong>
            </div>
          )}
        </div>
        <div>
          <p className="eyebrow"><Leaf size={16} /> Product detail</p>
          <h1>{product.name}</h1>
          <p className="detail-summary">{product.summary}</p>
          <div className="detail-meta">
            <span>{product.badge}</span>
            <span>{product.size}</span>
            <span>{product.price}</span>
          </div>
          <h2>Why it belongs in your pantry</h2>
          <ul>
            {product.details.map((item) => (
              <li key={item}><Check size={17} /> {item}</li>
            ))}
          </ul>
          <h2>How to prepare</h2>
          <p>{product.prep}</p>
          <a className="primary-button" href={`mailto:Info@EveGlofoods.com?subject=${encodeURIComponent(product.name)}`}>
            Ask about this item <Mail size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

function AboutPage({ navigate }) {
  return (
    <section className="content-page">
      <p className="eyebrow"><Leaf size={16} /> About EveGlo Foods</p>
      <h1>Healthy food should feel practical, joyful, and kinder to the planet.</h1>
      <p>
        EveGlo Foods is building a pantry collection for people who want familiar comfort foods with lighter,
        more balanced nutrition. Our focus is low-carb rice alternatives, shirataki noodles, and high-protein
        pasta that make everyday meals easier without asking families to give up flavor.
      </p>
      <div className="content-grid">
        <article>
          <h2>Food-first wellness</h2>
          <p>
            We believe better eating starts with simple swaps. EveGlo products are designed to support balanced
            meals, quick prep, and health-minded routines that can fit into busy homes.
          </p>
        </article>
        <article>
          <h2>Sustainability mindset</h2>
          <p>
            Our product direction prioritizes shelf-stable pantry staples, plant-forward ingredients, efficient
            meal planning, and reduced waste through longer-lasting formats.
          </p>
        </article>
        <article>
          <h2>Built for modern kitchens</h2>
          <p>
            From family dinners to wholesale shelves, EveGlo is being shaped around clean packaging, clear
            nutrition cues, and products that are easy to understand at a glance.
          </p>
        </article>
      </div>
      <button type="button" className="primary-button" onClick={() => navigate('home', 'shop')}>
        Explore the collection <ArrowRight size={18} />
      </button>
    </section>
  );
}

function PrivacyPolicyPage() {
  return (
    <section className="content-page policy-page">
      <p className="eyebrow"><ShieldCheck size={16} /> Privacy policy</p>
      <h1>EveGlo Foods Privacy Policy</h1>
      <p className="policy-date">Last updated: April 28, 2026</p>
      <p>
        This policy explains how EveGlo Foods collects, uses, protects, and shares information through this
        website. It is written for this site and follows common ecommerce privacy policy categories.
      </p>

      <h2>Information we collect</h2>
      <p>
        We may collect information you provide when you contact us, request wholesale details, join launch
        updates, place an order in the future, respond to a promotion, or use site features. This may include
        your name, email address, phone number, mailing or shipping address, company name, inquiry details,
        billing information when purchases are enabled, and any other information you choose to provide.
      </p>
      <p>
        Like many websites, we may collect technical information such as browser type, device information,
        pages visited, referring pages, approximate location, and cookies or similar technologies used to
        improve site performance and understand visitor activity.
      </p>

      <h2>How we use information</h2>
      <p>
        We use information to respond to inquiries, provide customer service, process future orders, send
        requested updates, manage wholesale or retail conversations, improve the website, personalize content,
        prevent misuse or fraud, meet legal obligations, and create aggregated information that does not
        identify individual visitors.
      </p>

      <h2>Cookies</h2>
      <p>
        Cookies may help the site remember preferences, measure traffic, understand how visitors use pages,
        and support future ecommerce features. You can adjust cookie settings in your browser. Some features
        may not work as intended if cookies are disabled.
      </p>

      <h2>Sharing information</h2>
      <p>
        We do not sell personal information. We may share information with service providers who help operate
        the website, email tools, analytics, order processing, payment processing, shipping, fraud prevention,
        professional support, or other services needed to run EveGlo Foods. We may also disclose information
        when required by law, to protect rights and safety, to enforce site terms, or as part of a lawful
        business transaction such as a merger or asset sale.
      </p>

      <h2>Security and retention</h2>
      <p>
        We use reasonable administrative, technical, and organizational safeguards to protect information.
        No online system can be guaranteed completely secure. We keep personal information only as long as
        reasonably needed for the purposes described here, unless a longer period is required by law.
      </p>

      <h2>Your choices</h2>
      <p>
        You may ask to update, correct, or remove information you have provided, and you may unsubscribe from
        marketing messages where an unsubscribe option is available. Transactional or service messages may
        still be sent when necessary.
      </p>

      <h2>Third-party links</h2>
      <p>
        This website may link to third-party sites. Their privacy practices are separate from EveGlo Foods,
        and we are not responsible for their content, policies, or practices.
      </p>

      <h2>Policy changes</h2>
      <p>
        We may update this policy from time to time. Updates will be posted on this page with a revised date.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions or requests, contact EveGlo Foods at{' '}
        <a href="mailto:Info@EveGlofoods.com">Info@EveGlofoods.com</a>.
      </p>
    </section>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div>
        <span className="footer-logo">
          <img src="/assets/eveglo-logo.png" alt="EveGlo Foods" />
        </span>
        <p>Modern low-carb, plant-forward pantry staples.</p>
      </div>
      <div>
        <h4>Shop</h4>
        <button type="button" onClick={() => navigate('home', 'shop')}>Low Carb Pasta</button>
        <button type="button" onClick={() => navigate('home', 'shop')}>Shirataki Rice</button>
        <button type="button" onClick={() => navigate('home', 'shop')}>High Protein Pasta</button>
      </div>
      <div>
        <h4>Company</h4>
        <button type="button" onClick={() => navigate('about')}>About</button>
        <button type="button" onClick={() => navigate('home', 'wholesale')}>Wholesale</button>
        <a href="mailto:Info@EveGlofoods.com">Contact us</a>
        <button type="button" onClick={() => navigate('privacy')}>Privacy Policy</button>
      </div>
      <div>
        <h4>Updates</h4>
        <p>Product launch, recipes, retail availability, and pantry notes.</p>
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [activeProduct, setActiveProduct] = useState(null);

  const navigate = (nextPage, section) => {
    setPage(nextPage);
    setActiveProduct(null);
    window.setTimeout(() => {
      if (nextPage === 'home' && section) {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  };

  const openProduct = (product) => {
    setActiveProduct(product);
    setPage('product');
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  return (
    <div className="app">
      <Header navigate={navigate} />
      <main>
        {page === 'home' && (
          <>
            <Hero navigate={navigate} />
            <CategoryStrip navigate={navigate} />
            <ComingSoon />
            <FeaturedCollection onOpenProduct={openProduct} />
            <PromoBand navigate={navigate} />
            <Highlights />
            <Testimonials />
            <Wholesale />
          </>
        )}
        {page === 'about' && <AboutPage navigate={navigate} />}
        {page === 'privacy' && <PrivacyPolicyPage />}
        {page === 'product' && <ProductDetail product={activeProduct} navigate={navigate} />}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}
