import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Leaf,
  Mail,
  Megaphone,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X
} from 'lucide-react';
import { departments, highlights, konjacFacts, products } from './productData.js';
import glowFinderEngine from './glowFinderProductEngine.json';
import recipeReference from './recipeReferenceManifest.json';

const heroImage = {
  image: '/assets/hero-gallery/collection-mockup-5.png',
  alt: 'EveGlo Foods retail product collection mockup'
};

const glowLocale = 'en-CA';
const glowProducts = glowFinderEngine.products;
const glowQuestions = glowFinderEngine.ui.questions;

function textFor(value) {
  const raw = typeof value === 'string' ? value : value?.[glowLocale] || value?.['en-CA'] || '';
  return raw
    .replaceAll('EveGlō', 'EveGlo')
    .replaceAll('EveGlÅ', 'EveGlo')
    .replaceAll('EveGlÅ', 'EveGlo')
    .replaceAll('â€™', "'")
    .replaceAll('â€“', '-')
    .replaceAll('Ã©', 'e')
    .replaceAll('Ã¨', 'e')
    .replaceAll('Ã¢', 'a')
    .replaceAll('Ã´', 'o')
    .replaceAll('Ã»', 'u');
}

function formatNutrition(product) {
  const parts = [];
  if (product.nutrition?.calories) parts.push(`${product.nutrition.calories} calories`);
  if (product.nutrition?.proteinG) parts.push(`${product.nutrition.proteinG}g protein`);
  if (product.nutrition?.netCarbsG) parts.push(`${product.nutrition.netCarbsG}g net carbs`);
  if (product.nutrition?.carbohydrateG) parts.push(`${product.nutrition.carbohydrateG}g carbohydrate`);
  return parts.slice(0, 3);
}

function scoreGlowProducts(answers) {
  return glowProducts
    .map((product) => {
      const score = glowFinderEngine.scoringModel.rules.reduce((total, rule) => {
        const matches = Object.entries(rule.when).every(([questionId, answerId]) => answers[questionId] === answerId);
        return total + (matches ? rule.add[product.id] || 0 : 0);
      }, 0);
      const exactShapeBonus = answers.shape && answers.shape !== 'surprise' && product.format === answers.shape ? 3 : 0;
      const tagBonus = Object.values(answers).filter(Boolean).reduce((total, answer) => (
        product.tags?.includes(answer) ? total + 1 : total
      ), 0);
      return { product, score: score + exactShapeBonus + tagBonus };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aQuick = a.product.tags?.includes('quick_meal') ? 1 : 0;
      const bQuick = b.product.tags?.includes('quick_meal') ? 1 : 0;
      if (bQuick !== aQuick) return bQuick - aQuick;
      return textFor(a.product.name).localeCompare(textFor(b.product.name));
    });
}

function recipeImagePath(recipe) {
  return `/assets/eveglo/recipes/${recipe.webp.split('/').pop()}`;
}

function normalizeRecipeMatch(value) {
  return textFor(value)
    .toLowerCase()
    .replaceAll('eveglo', '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function recipeMatchesProduct(recipe, product) {
  if (!product) return false;

  const recipeId = recipe.id.toLowerCase();
  const productId = product.id.toLowerCase();
  const recipeProduct = normalizeRecipeMatch(recipe.product);
  const productName = normalizeRecipeMatch(product.name);

  return recipeId.includes(productId) || recipeProduct.includes(productName) || productName.includes(recipeProduct);
}

function selectedGlowLabels(answers) {
  return glowQuestions.map((question) => {
    const option = question.options.find((item) => item.id === answers[question.id]);
    return option ? textFor(option.label) : '';
  }).filter(Boolean);
}

function scoreRecipeIdea(recipe, recommendedProducts, selectedTerms) {
  const productScore = recommendedProducts.reduce((total, product, index) => {
    if (!recipeMatchesProduct(recipe, product)) return total;
    if (index === 0) return total + 24;
    if (index < 3) return total + 12;
    return total + 6;
  }, 0);
  const searchableRecipe = [
    recipe.id,
    recipe.product,
    recipe.dish,
    ...recipe.tags,
    ...recipe.ingredients.slice(0, 4)
  ].map(normalizeRecipeMatch).join(' ');
  const termScore = selectedTerms.reduce((total, term) => (
    searchableRecipe.includes(term) ? total + 4 : total
  ), 0);
  const tagScore = recipe.tags.reduce((total, tag) => {
    const normalizedTag = normalizeRecipeMatch(tag);
    return total + selectedTerms.reduce((tagTotal, term) => (
      normalizedTag.includes(term) || term.includes(normalizedTag) ? tagTotal + 5 : tagTotal
    ), 0);
  }, 0);

  return productScore + termScore + tagScore;
}

function FoodCharacter({ variant, className = '' }) {
  return (
    <div className={`food-character ${variant} ${className}`} aria-hidden="true">
      <span className="character-stem" />
      <span className="character-leaf leaf-left" />
      <span className="character-leaf leaf-right" />
      <span className="character-body">
        <span className="character-face" />
      </span>
      <span className="character-arm arm-left" />
      <span className="character-arm arm-right" />
      <span className="character-shadow" />
    </div>
  );
}

function Header({ navigate, onSearch }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const go = (page, section) => {
    setOpen(false);
    navigate(page, section);
  };
  const submitSearch = (event) => {
    event.preventDefault();
    onSearch(searchTerm.trim());
    setOpen(false);
    setSearchOpen(false);
    navigate('home', 'shop');
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
          <button type="button" onClick={() => go('glow')}>Glow Finder</button>
          <button type="button" onClick={() => go('about')}>About</button>
          <a href="/news/eveglo-foods-launch-delay/">News</a>
          <button type="button" onClick={() => go('home', 'wholesale')}>Wholesale</button>
        </div>

        <div className="nav-actions">
          <button type="button" aria-label="Search products" onClick={() => setSearchOpen((current) => !current)}><Search size={19} /></button>
          <a href="mailto:Info@EveGlofoods.com" aria-label="Contact us"><Mail size={19} /></a>
          <button type="button" className="cart-button" aria-label="Cart"><ShoppingBag size={19} /></button>
        </div>
      </nav>
      {searchOpen && (
        <form className="site-search" onSubmit={submitSearch}>
          <Search size={18} />
          <input
            autoFocus
            type="search"
            value={searchTerm}
            placeholder="Search pasta, rice, protein..."
            aria-label="Search products"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      )}
    </header>
  );
}

function Hero({ navigate }) {
  return (
    <section className="hero" id="home">
      <div className="hero-visual" aria-label="EveGlo product collection">
        <div className="hero-image-frame">
          <img src={heroImage.image} alt={heroImage.alt} />
          <div className="hero-title-panel">
            <p className="eyebrow"><Leaf size={16} /> Plant-forward pantry essentials</p>
            <h1>
              <span>Clean comfort</span>
              <span>foods for modern</span>
              <span>low-carb kitchens.</span>
            </h1>
          </div>
          <FoodCharacter variant="sprout" className="hero-character" />
        </div>
      </div>

      <div className="hero-copy">
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
      <FoodCharacter variant="rice" className="coming-character" />
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

function HomeLaunchUpdate() {
  const [open, setOpen] = useState(false);

  return (
    <section className={`home-launch-update ${open ? 'is-open' : ''}`} aria-label="Launch update">
      <button
        type="button"
        className="launch-update-toggle"
        aria-expanded={open}
        aria-controls="home-launch-update-panel"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="launch-update-icon"><Megaphone size={19} /></span>
        <span>
          <small>Launch update</small>
          <strong>EveGlo Foods launch delayed during ongoing Pacdora dispute</strong>
        </span>
        <time dateTime="2026-04-28">April 28, 2026</time>
        <ChevronDown size={20} className="launch-update-chevron" aria-hidden="true" />
      </button>

      <div className="launch-update-panel" id="home-launch-update-panel">
        <div className="launch-update-content">
          <p>
            EveGlo Foods is temporarily delaying its product launch due to an ongoing dispute with Pacdora,
            a packaging mockup and dieline platform used by creators and packaging teams.
          </p>
          <p>
            This has been a difficult chapter for a small Alberta team working to bring a new health-focused
            pantry brand to market. Even with the delay, EveGlo Foods remains committed to protecting the
            brand, preserving the product vision, and moving forward with care.
          </p>
          <p>
            Further updates and announcements about launch timing, product availability, and next steps will
            be released in the coming weeks.
          </p>
          <a href="/news/eveglo-foods-launch-delay/">Read the full update <ArrowRight size={17} /></a>
        </div>
      </div>
    </section>
  );
}

function GlowFinder({ navigate }) {
  const defaultAnswers = useMemo(() => Object.fromEntries(
    glowQuestions.map((question) => [question.id, question.options[0]?.id || ''])
  ), []);
  const [answers, setAnswers] = useState(defaultAnswers);

  const scoredProducts = useMemo(() => scoreGlowProducts(answers), [answers]);
  const bestMatch = scoredProducts[0]?.product;
  const alternates = scoredProducts.slice(1, 3).map((item) => item.product);
  const selectedValues = Object.values(answers);
  const selectedLabels = useMemo(() => selectedGlowLabels(answers), [answers]);
  const bundle = glowFinderEngine.bundles.find((item) => (
    item.bestFor.some((tag) => selectedValues.includes(tag)) ||
    item.products.includes(bestMatch?.id)
  )) || glowFinderEngine.bundles[0];
  const recipeIdeas = useMemo(() => {
    const bundleProducts = bundle.products
      .map((productId) => glowProducts.find((product) => product.id === productId))
      .filter(Boolean);
    const recommendedProducts = [bestMatch, ...alternates, ...bundleProducts]
      .filter((product, index, list) => product && list.findIndex((item) => item.id === product.id) === index);
    const selectedTerms = [...selectedValues, ...selectedLabels]
      .map(normalizeRecipeMatch)
      .filter((term) => term && term !== 'recommend for me' && term !== 'no preference');
    return recipeReference.items
      .map((recipe) => ({
        recipe,
        score: scoreRecipeIdea(recipe, recommendedProducts, selectedTerms)
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return textFor(a.recipe.dish).localeCompare(textFor(b.recipe.dish));
      })
      .map((item) => item.recipe)
      .slice(0, 4);
  }, [bestMatch, alternates, bundle, selectedValues, selectedLabels]);

  const updateAnswer = (questionId, optionId) => {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
  };

  return (
    <section className="glow-finder" id="glow-finder">
      <div className="glow-finder-intro">
        <p className="eyebrow"><Sparkles size={16} /> {textFor(glowFinderEngine.ui.entry.eyebrow)}</p>
        <h2>{textFor(glowFinderEngine.ui.entry.headline)}</h2>
        <p>{textFor(glowFinderEngine.ui.entry.body)}</p>
      </div>

      <div className="glow-finder-shell">
        <div className="glow-workspace">
          <div className="glow-quiz" aria-label="Glow Finder questions">
            {glowQuestions.map((question, index) => (
              <fieldset className="glow-question" key={question.id}>
                <legend>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {textFor(question.label)}
                </legend>
                <div className="glow-options">
                  {question.options.map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      className={answers[question.id] === option.id ? 'active' : ''}
                      onClick={() => updateAnswer(question.id, option.id)}
                    >
                      {textFor(option.label)}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="result-recipes" key={recipeIdeas.map((recipe) => recipe.id).join('-')} aria-label="Serving ideas for the selected Glow Finder result">
            <div className="result-recipes-heading">
              <span><Leaf size={15} /> Serving ideas</span>
              <h4>{bestMatch ? `Meal ideas for ${textFor(bestMatch.name)}` : 'Meal ideas'}</h4>
              <p>
                Inspiration only: EveGlo products can be used as the base ingredient, while sauces, vegetables, proteins, and toppings are meal ideas.
              </p>
              <div className="selected-recipe-tags" aria-label="Current Glow Finder selections">
                {selectedLabels.map((label) => <span key={label}>{label}</span>)}
              </div>
            </div>
            <div className="result-recipe-list">
              {recipeIdeas.map((recipe) => (
                <article className="result-recipe-card" key={recipe.id}>
                  <img src={recipeImagePath(recipe)} alt={textFor(recipe.dish)} loading="lazy" decoding="async" />
                  <div>
                    <span>{textFor(recipe.product)}</span>
                    <h5>{textFor(recipe.dish)}</h5>
                    <p>{textFor(recipe.websiteNote)}</p>
                    <ul aria-label={`Ingredients for ${textFor(recipe.dish)}`}>
                      {recipe.ingredients.slice(0, 5).map((ingredient) => (
                        <li key={ingredient}>{textFor(ingredient)}</li>
                      ))}
                      {recipe.ingredients.length > 5 && <li>+{recipe.ingredients.length - 5} more</li>}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {bestMatch && (
          <aside className="glow-result" aria-live="polite">
            <div className="result-label">{textFor(glowFinderEngine.ui.resultLabels.bestMatch)}</div>
            <div className="result-card" key={bestMatch.id}>
              <div className="result-image">
                <img src={bestMatch.image} alt={textFor(bestMatch.name)} loading="lazy" decoding="async" />
              </div>
              <div>
                <p>{bestMatch.packSize}</p>
                <h3>{textFor(bestMatch.name)}</h3>
                <div className="result-chips">
                  {formatNutrition(bestMatch).map((item) => <span key={item}>{item}</span>)}
                </div>
                <h4>{textFor(glowFinderEngine.ui.resultLabels.whyItFits)}</h4>
                <p>
                  This match lines up with your meal goal, preferred format, and flavour direction while keeping EveGlo's lighter pantry positioning front and centre.
                </p>
              </div>
            </div>

            <div className="also-good">
              <span>{textFor(glowFinderEngine.ui.resultLabels.alsoGood)}</span>
              {alternates.map((product) => (
                <button type="button" key={product.id} onClick={() => navigate('home', 'shop')}>
                  <img src={product.image} alt="" loading="lazy" decoding="async" />
                  <strong>{textFor(product.name)}</strong>
                </button>
              ))}
            </div>

            <div className="bundle-card">
              <span>{textFor(glowFinderEngine.ui.resultLabels.bundleSuggestion)}</span>
              <strong>{textFor(bundle.name)}</strong>
              <p>{bundle.products.length} products matched for your meal direction.</p>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product, onOpenProduct, className = '' }) {
  return (
    <article className={`product-card accent-${product.accent} ${className}`}>
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

function FeaturedCollection({ onOpenProduct, searchQuery, onSearchChange }) {
  const [filter, setFilter] = useState('All');
  const carouselRef = useRef(null);
  const isInteractingRef = useRef(false);
  const filters = ['All', 'Low carb', 'High protein', 'Rice', 'Pasta'];

  const visibleProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const value = filter.toLowerCase();
    return products.filter((product) => {
      const searchable = [
        product.name,
        product.tag,
        product.badge,
        product.size,
        product.summary,
        ...product.details
      ].join(' ').toLowerCase();
      const matchesFilter = filter === 'All' || searchable.includes(value);
      const matchesSearch = !query || searchable.includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || visibleProducts.length === 0) return undefined;

    const mobileQuery = window.matchMedia('(max-width: 700px), (hover: none) and (pointer: coarse)');
    if (!mobileQuery.matches) return undefined;

    const speed = 34;
    let animationFrameId;
    let lastFrameTime;
    let resumeTimer;
    let currentScroll = carousel.scrollLeft;

    const normalizeLoop = () => {
      const loopPoint = carousel.scrollWidth / 2;
      if (loopPoint <= carousel.clientWidth) return;

      if (carousel.scrollLeft >= loopPoint) {
        carousel.scrollLeft -= loopPoint;
      } else if (carousel.scrollLeft <= 0 && isInteractingRef.current) {
        carousel.scrollLeft += loopPoint;
      }

      currentScroll = carousel.scrollLeft;
    };

    const stopAnimation = () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = undefined;
      }
      lastFrameTime = undefined;
    };

    const handlePointerDown = () => {
      window.clearTimeout(resumeTimer);
      isInteractingRef.current = true;
      stopAnimation();
      currentScroll = carousel.scrollLeft;
    };
    const handlePointerDone = () => {
      currentScroll = carousel.scrollLeft;
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        isInteractingRef.current = false;
        currentScroll = carousel.scrollLeft;
        animationFrameId = window.requestAnimationFrame(tick);
      }, 900);
    };

    function tick(frameTime) {
      if (document.visibilityState !== 'visible') {
        lastFrameTime = undefined;
        animationFrameId = window.requestAnimationFrame(tick);
        return;
      }
      const loopPoint = carousel.scrollWidth / 2;

      if (!isInteractingRef.current && loopPoint > carousel.clientWidth) {
        if (lastFrameTime === undefined) {
          lastFrameTime = frameTime;
        }
        const elapsedSeconds = Math.min((frameTime - lastFrameTime) / 1000, 0.08);
        lastFrameTime = frameTime;
        currentScroll += speed * elapsedSeconds;
        if (currentScroll >= loopPoint) {
          currentScroll -= loopPoint;
        }
        carousel.scrollLeft = currentScroll;
      } else {
        lastFrameTime = frameTime;
      }

      if (isInteractingRef.current) {
        normalizeLoop();
      }
      animationFrameId = window.requestAnimationFrame(tick);
    }

    const handleScroll = () => {
      if (isInteractingRef.current) {
        currentScroll = carousel.scrollLeft;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        currentScroll = carousel.scrollLeft;
        lastFrameTime = undefined;
      }
    };

    carousel.style.scrollBehavior = 'auto';
    carousel.addEventListener('pointerdown', handlePointerDown);
    carousel.addEventListener('pointerup', handlePointerDone);
    carousel.addEventListener('pointercancel', handlePointerDone);
    carousel.addEventListener('pointerleave', handlePointerDone);
    carousel.addEventListener('touchstart', handlePointerDown, { passive: true });
    carousel.addEventListener('touchend', handlePointerDone, { passive: true });
    carousel.addEventListener('touchcancel', handlePointerDone, { passive: true });
    carousel.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrameId = window.requestAnimationFrame(tick);

    return () => {
      stopAnimation();
      window.clearTimeout(resumeTimer);
      carousel.removeEventListener('pointerdown', handlePointerDown);
      carousel.removeEventListener('pointerup', handlePointerDone);
      carousel.removeEventListener('pointercancel', handlePointerDone);
      carousel.removeEventListener('pointerleave', handlePointerDone);
      carousel.removeEventListener('touchstart', handlePointerDown);
      carousel.removeEventListener('touchend', handlePointerDone);
      carousel.removeEventListener('touchcancel', handlePointerDone);
      carousel.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [visibleProducts.length]);

  return (
    <section className="collection" id="shop">
      <div className="section-heading">
        <FoodCharacter variant="noodle" className="collection-character" />
        <p className="eyebrow"><Sparkles size={16} /> Featured collection</p>
        <h2>Guilt-free pasta and rice, positioned for premium shelves.</h2>
        <p>
          Product quantities are listed around EveGlo's 150g format with launch pricing aligned to comparable better-for-you pantry products.
        </p>
      </div>

      <label className="collection-search">
        <Search size={18} />
        <input
          type="search"
          value={searchQuery}
          placeholder="Search the collection"
          aria-label="Search the collection"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

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

      <div className="product-grid" ref={carouselRef}>
        {visibleProducts.map((product) => (
          <ProductCard key={product.name} product={product} onOpenProduct={onOpenProduct} />
        ))}
        {visibleProducts.map((product) => (
          <ProductCard
            key={`${product.name}-mobile-loop`}
            product={product}
            onOpenProduct={onOpenProduct}
            className="mobile-loop-card"
          />
        ))}
      </div>
      {visibleProducts.length === 0 && (
        <p className="empty-search">No products matched "{searchQuery}". Try pasta, rice, protein, or shirataki.</p>
      )}
    </section>
  );
}

function PromoBand({ navigate }) {
  return (
    <section className="promo-band">
      <div>
        <p className="eyebrow"><Truck size={16} /> Retail ready</p>
        <h2>Built for online orders and grocery shelves from day one.</h2>
      </div>
      <figure className="promo-photo">
        <img src="/assets/eveglo-product-in-box.jpg" alt="EveGlo Foods product displayed in a branded shipping box" />
      </figure>
      <div className="promo-copy">
        <p>
          EveGlo is being prepared for both direct online ordering and retail buyer conversations, with clear product presentation, launch updates, wholesale details, and shelf-ready brand materials.
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

function KonjacFacts() {
  const [activeFact, setActiveFact] = useState('');
  const toggleFact = (title) => {
    const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isDesktopPointer) return;
    setActiveFact((current) => (current === title ? '' : title));
  };

  return (
    <section className="konjac-section">
      <div className="section-heading compact">
        <p className="eyebrow"><Leaf size={16} /> Konjac facts</p>
        <h2>Why konjac makes lighter comfort food worth trying.</h2>
        <p className="konjac-mobile-hint">Tap any fact to see more.</p>
      </div>
      <div className="konjac-layout">
        <figure className="konjac-frame">
          <img src="/assets/konjac-mockup.png" alt="Konjac product mockup for EveGlo Foods" />
        </figure>
        <div className="konjac-facts" aria-label="Konjac facts">
          {konjacFacts.map((fact) => (
            <button
              type="button"
              key={fact.title}
              className={`konjac-fact ${activeFact === fact.title ? 'is-active' : ''}`}
              aria-expanded={activeFact === fact.title}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setActiveFact(fact.title);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === 'mouse') setActiveFact('');
              }}
              onClick={() => toggleFact(fact.title)}
            >
              <span>{fact.kicker}</span>
              <strong>{fact.title}</strong>
              <em>{fact.detail}</em>
            </button>
          ))}
        </div>
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
      <p>
        EveGlo Foods is owned and operated by Harmony Resource Hub Alberta Inc. Learn more at{' '}
        <a href="https://www.harmonyresourcehub.ca" target="_blank" rel="noreferrer">www.Harmonyresourcehub.ca</a>.
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

function UpdatesPage() {
  return (
    <section className="content-page updates-page">
      <p className="eyebrow"><Megaphone size={16} /> Launch updates</p>
      <h1>Product launch update from our Alberta team.</h1>
      <article className="announcement-card">
        <div>
          <span>Launch notice</span>
          <time dateTime="2026-04-28">April 28, 2026</time>
        </div>
        <h2>EveGlo Foods launch delayed during ongoing Pacdora dispute</h2>
        <p>
          EveGlo Foods is temporarily delaying its product launch due to an ongoing dispute with Pacdora,
          a packaging mockup and dieline platform used by creators and packaging teams.
        </p>
        <p>
          This has been a difficult chapter for a small Alberta team working to bring a new health-focused
          pantry brand to market. Even with the delay, EveGlo Foods remains committed to protecting the
          brand, preserving the product vision, and moving forward with care.
        </p>
        <p>
          Further updates and announcements about launch timing, product availability, and next steps will
          be released in the coming weeks.
        </p>
      </article>
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
        <button type="button" onClick={() => navigate('glow')}>Glow Finder</button>
        <a href="/news/eveglo-foods-launch-delay/">News</a>
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

function MobileDock({ navigate, onSearch }) {
  const openShop = () => {
    onSearch('');
    navigate('home', 'shop');
  };

  return (
    <nav className="mobile-dock" aria-label="Mobile quick actions">
      <button type="button" onClick={() => navigate('home', 'home')}>
        <Leaf size={18} />
        <span>Home</span>
      </button>
      <button type="button" onClick={openShop}>
        <Search size={18} />
        <span>Shop</span>
      </button>
      <button type="button" onClick={() => navigate('glow')}>
        <Sparkles size={18} />
        <span>Finder</span>
      </button>
      <a href="/news/eveglo-foods-launch-delay/">
        <Megaphone size={18} />
        <span>News</span>
      </a>
    </nav>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [activeProduct, setActiveProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      <Header navigate={navigate} onSearch={setSearchQuery} />
      <main>
        {page === 'home' && (
          <>
            <Hero navigate={navigate} />
            <CategoryStrip navigate={navigate} />
            <ComingSoon />
            <HomeLaunchUpdate />
            <FeaturedCollection
              onOpenProduct={openProduct}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <PromoBand navigate={navigate} />
            <Highlights />
            <KonjacFacts />
            <Wholesale />
          </>
        )}
        {page === 'glow' && <GlowFinder navigate={navigate} />}
        {page === 'about' && <AboutPage navigate={navigate} />}
        {page === 'updates' && <UpdatesPage />}
        {page === 'privacy' && <PrivacyPolicyPage />}
        {page === 'product' && <ProductDetail product={activeProduct} navigate={navigate} />}
      </main>
      <MobileDock navigate={navigate} onSearch={setSearchQuery} />
      <Footer navigate={navigate} />
    </div>
  );
}
