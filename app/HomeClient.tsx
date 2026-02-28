'use client';

import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import styles from './page.module.css';
import Link from 'next/link';

export default function HomeClient({ initialProducts }: { initialProducts: any[] }) {
    const [bgIndex, setBgIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [productsWithImages, setProductsWithImages] = useState(initialProducts);

    const backgroundImages = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBzmGJ150eNL_2BFjwln4kOVWF3Duflm-YhSa05td8XL9046Txd8nQ4nCBukeRxbVjNgHEnnj_kvltDKirRGTAkBhclggD2uvnQR8uDH1CaTOGY1ScLOC8jfULAsY1prcd0bDubEu8To1DkoC1nH2CbNY8L7GyMQV9z5cqNxAfaC2xjH3GPAPZWyIFWwmaEuCpeP5_Noucr7FmVdZzUg6940_nMrdntHZB3fMOTST7a2692bI5v2WzOfvA_O-qNwbLCJplWGAMMhrk',
        '/images/hero-bg-2.jpg'
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    // Load full product images in background to avoid Vercel 128KB payload limit
    useEffect(() => {
        const fetchFullData = async () => {
            try {
                const res = await fetch('/api/products');
                const fullData = await res.json();
                if (Array.isArray(fullData)) {
                    // Update only those products we are showing initial data for
                    setProductsWithImages(fullData.slice(0, 6));
                }
            } catch (err) {
                console.error('Failed to pre-fetch home images:', err);
            }
        };
        fetchFullData();
    }, []);

    const products = productsWithImages;

    return (
        <main className={styles.home}>
            <Navbar />

            {/* Hero Section */}
            <section className={styles.hero}>
                {backgroundImages.map((src, index) => (
                    <div
                        key={src}
                        className={`${styles.heroBg} ${index === bgIndex ? styles.activeBg : ''}`}
                        style={{ backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2)), url('${src}')` }}
                    ></div>
                ))}
                <div className="container">
                    <div className={styles.heroContent}>
                        <h1 className={`${styles.heroTitle} ${styles.animateFadeUp}`}>
                            Bring Nature to Your <span>Home</span>
                        </h1>
                        <p className={`${styles.heroDescription} ${styles.animateFadeUp} ${styles.delay1}`}>
                            Transform your living space into a tranquil sanctuary with our curated collection of sustainable, high-quality plants.
                        </p>
                        <div className={`${styles.heroActions} ${styles.animateFadeUp} ${styles.delay2}`}>
                            <Link href="/shop" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                                Shop Now <span className="material-symbols-outlined" style={{ marginLeft: '0.5rem' }}>arrow_forward</span>
                            </Link>
                            <Link href="#contact" className={styles.secondaryBtn} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                Visit Our Greenhouse
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro Section */}
            <section className={styles.intro} id="about">
                <div className={`container ${styles.introFlex}`}>
                    <div className={`${styles.introImage} ${styles.animateFadeInLeft}`}>
                        <img src="/images/story_farmer.png" alt="Zain Nursery Story" />
                    </div>
                    <div className={`${styles.introContent} ${styles.animateFadeInRight}`}>
                        <span className={styles.tagline}>Our Story</span>
                        <h2 className={styles.sectionTitle}>Zain Nursery Garden 🌿</h2>
                        <p className={styles.introText}>
                            Zain Nursery Garden began with a simple dream — to bring nature closer to every home. What started as a small collection of plants, grown with love and patience, has blossomed into a trusted green space for plant lovers.
                            <br /><br />
                            We believe plants are more than decoration — they bring life, peace, fresh air, and happiness. Every plant in our nursery is carefully nurtured to ensure it reaches you healthy, vibrant, and ready to grow.
                            <br /><br />
                            From indoor plants to outdoor gardens, from small pots to complete landscaping support, Zain Nursery Garden is here to help you create your own green paradise.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Plants Section */}
            <section className={styles.featured}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2 className={styles.sectionTitle} style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Featured Favorites</h2>
                            <p className={styles.introText} style={{ textAlign: 'left', fontSize: '1rem' }}>Our most loved plants this season</p>
                        </div>
                        <Link href="/shop" className={styles.viewAll}>
                            View All <span className="material-symbols-outlined">chevron_right</span>
                        </Link>
                    </div>

                    <div className={styles.scrollWrapper}>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product.id} className={styles.card}>
                                    <div className={styles.imageWrapper} onClick={() => setSelectedImage(product)}>
                                        <img src={product.image} alt={product.name} className={styles.cardImage} />
                                        <button className={styles.favoriteBtn} onClick={e => e.stopPropagation()}>
                                            <span className="material-symbols-outlined">favorite</span>
                                        </button>
                                        <div className={styles.viewOverlay}>
                                            <span className="material-symbols-outlined">zoom_in</span>
                                        </div>
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <span className={styles.cardCategory}>{product.category}</span>
                                        <h3 className={styles.cardTitle}>{product.name}</h3>

                                        <div className={styles.productStatus}>
                                            <span className={styles.stockLabel}>📦 {product.stock || 0} in stock</span>
                                        </div>

                                        <div className={styles.rateGroup}>
                                            <span className={styles.price}>₹{typeof product.price === 'number' ? product.price.toFixed(2) : (parseFloat(product.price) || 0).toFixed(2)}</span>
                                            <span className={styles.wholesaleLabel}>Wholesale Rate</span>
                                        </div>

                                        <div className={styles.footer}>
                                            <a
                                                href={`https://wa.me/919605088858?text=Hi, I'm interested in the ${product.name} (₹${product.price})`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.contactBtn}
                                            >
                                                Contact Us
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ width: '100%', textAlign: 'center', padding: '2rem' }}>No products found.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className={styles.benefits}>
                <div className="container">
                    <div className={styles.benefitsGrid}>
                        <div className={styles.benefitItem}>
                            <div className={styles.benefitIcon}>
                                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem' }}>eco</span>
                            </div>
                            <h3 className={styles.benefitTitle}>Fresh Plants</h3>
                            <p className={styles.benefitText}>Straight from our greenhouse to your door, ensuring maximum health and vitality.</p>
                        </div>

                        <div className={styles.benefitItem}>
                            <div className={styles.benefitIcon}>
                                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem' }}>payments</span>
                            </div>
                            <h3 className={styles.benefitTitle}>Affordable Price</h3>
                            <p className={styles.benefitText}>Nature shouldn't be a luxury. We offer competitive pricing for premium botanical species.</p>
                        </div>

                        <div className={styles.benefitItem}>
                            <div className={styles.benefitIcon}>
                                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem' }}>local_shipping</span>
                            </div>
                            <h3 className={styles.benefitTitle}>Home Delivery</h3>
                            <p className={styles.benefitText}>Carefully packaged and handled with love, we deliver safely across the city.</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Model Products Section */}
            <section className={styles.modelSection}>
                <div className="container">
                    <div className={styles.modelGrid}>
                        <div className={styles.modelCard}>
                            <div className={styles.modelImage}>
                                <span className={styles.newsPrice}>₹450</span>
                                <img src="/images/jackfruit_final.jpg" alt="Premium Honey Jackfruit" />
                            </div>
                            <div className={styles.modelContent}>
                                <h3 className={styles.modelTitle}>HONEY JACKFRUIT</h3>
                                <span className={styles.modelCategory}>Premium Tropical Fruit</span>
                                <p className={styles.modelDescription}>The sweetest variety from our farm. Known for its honey-like pulp and small seeds.</p>
                                <a href="/shop" className={styles.detailsBtn}>
                                    View Details
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </a>
                            </div>
                        </div>

                        <div className={styles.modelCard}>
                            <div className={styles.modelImage}>
                                <span className={styles.newsPrice}>₹350</span>
                                <img src="/artifacts/mangosteen_fruit_detail_1772283126335.png" alt="Mangosteen" />
                            </div>
                            <div className={styles.modelContent}>
                                <h3 className={styles.modelTitle}>MANGOSTEEN</h3>
                                <span className={styles.modelCategory}>Tropical Fruit Plant</span>
                                <p className={styles.modelDescription}>Known as queen of fruits,Highly valued for its juicy, delicate texture and slightly sweet and sour flavour.</p>
                                <a href="/shop" className={styles.detailsBtn}>
                                    View Details
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </a>
                            </div>
                        </div>

                        <div className={styles.modelCard}>
                            <div className={styles.modelImage}>
                                <span className={styles.newsPrice}>₹180</span>
                                <img src="/images/coconut_final.jpg" alt="Coconut Plants" />
                            </div>
                            <div className={styles.modelContent}>
                                <h3 className={styles.modelTitle}>COCUTNUT PLANTS</h3>
                                <span className={styles.modelCategory}>Tropical Fruit Plant</span>
                                <p className={styles.modelDescription}>Malesian Kullan, Kuttiadi are best among in our farm. Highly productive variety.</p>
                                <a href="/shop" className={styles.detailsBtn}>
                                    View Details
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Farm Stories & R&D Section - 2nd Model Style */}
            <section className={styles.storiesSection}>
                <div className="container">
                    <div className={styles.storiesGrid}>
                        <div className={styles.videoSection}>
                            <h2 className={styles.storyTitle}>Farm stories</h2>
                            <div className={styles.videoWrapper}>
                                <iframe
                                    src="https://www.youtube.com/embed/S_7b7pS9P_o"
                                    title="Mangosteen Cultivation"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <Link href="/shop" className={styles.moreBtn}>More Stories</Link>
                        </div>

                        <div className={styles.rdSection}>
                            <h2 className={styles.storyTitle}>Research & Development</h2>
                            <div className={styles.rdContent}>
                                <div className={styles.rdImage}>
                                    <img src="/artifacts/research_development_nursery_1772283099544.png" alt="R&D Lab" />
                                </div>
                                <p className={styles.rdText}>
                                    Zain Nursery Biotech, having studied and proven that many of the tropical fruits of Southeast Asian origin can be profitably cultivated in the Indian soil, is investing a great deal of effort and resources into active research - not only into the acclimatization of these fruit trees to Indian geographical conditions, but also into developing new and improved varieties of fruits.
                                </p>
                            </div>
                            <Link href="/about" className={styles.moreBtn}>More Details</Link>
                        </div>
                    </div>
                </div>
            </section>


            {/* Contact & Map */}
            <section className={styles.contact} id="contact">
                <div className="container">
                    <h2 className={styles.sectionTitle} style={{ textAlign: 'center', color: '#fff', marginBottom: '3rem' }}>Visit Our Greenhouse</h2>

                    <div className={styles.contactFlex}>
                        <div className={styles.contactCard}>
                            <div className={styles.contactInfo}>
                                <div className={styles.infoItem}>
                                    <div className={styles.infoIcon}>
                                        <span className="material-symbols-outlined">location_on</span>
                                    </div>
                                    <div>
                                        <span className={styles.infoTitle}>Address</span>
                                        <p className={styles.infoText}>Zain Nursery, Q3VW+PRM, Kundukad, Aloor, Kerala 679534</p>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.infoIcon}>
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                    <div>
                                        <span className={styles.infoTitle}>Phone</span>
                                        <p className={styles.infoText}>+91 9605088858</p>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.infoIcon}>
                                        <span className="material-symbols-outlined">schedule</span>
                                    </div>
                                    <div>
                                        <span className={styles.infoTitle}>Opening Hours</span>
                                        <p className={styles.infoText}>Mon - Sat: 9AM - 6PM<br />Sun: 10AM - 4PM</p>
                                    </div>
                                </div>
                            </div>
                            <a
                                href="https://www.google.com/maps/dir//Zain+Nursery,+Q3VW%2BPRM,+Kundukad,+Aloor,+Kerala+679534"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.directionsBtn}
                            >
                                <span className="material-symbols-outlined">directions</span> Get Directions
                            </a>
                        </div>

                        <div className={styles.map}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15654.40860548148!2d76.32!3d10.63!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7e6345678901b%3A0x1234567890abcedf!2sKundukad%2C%20Kerala%20679534!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '2rem' }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <div className={styles.mapOverlay}>
                                <b>Zain Nursery</b>
                                <p>Q3VW+PRM, Kundukad</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            {selectedImage && (
                <div className={styles.modal} onClick={() => setSelectedImage(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setSelectedImage(null)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <img src={selectedImage.image} alt={selectedImage.name} className={styles.modalImage} />
                        <div className={styles.modalInfo}>
                            <h3>{selectedImage.name}</h3>
                            <p>₹{selectedImage.price} - Wholesale Price</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
