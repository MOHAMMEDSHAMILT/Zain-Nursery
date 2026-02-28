'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import ProductCard from '../components/shop/ProductCard';
import styles from './page.module.css';
import cardStyles from '../components/shop/ProductCard.module.css';

export default function ShopClient({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts || []);
    const [activeCategory, setActiveCategory] = useState('All Plants');
    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Fetch full data (with images) on the client side to bypass Vercel's payload limits
    useEffect(() => {
        const fetchFullData = async () => {
            try {
                const res = await fetch('/api/products');
                const fullData = await res.json();
                if (Array.isArray(fullData)) {
                    setProducts(fullData);
                }
            } catch (err) {
                console.error('Failed to load full product images:', err);
            }
        };
        fetchFullData();
    }, []);

    const validProducts = Array.isArray(products) ? products : [];
    const categories = ['All Plants', ...new Set(validProducts.filter(p => p && p.category).map(p => p.category))];

    const filteredProducts = activeCategory === 'All Plants'
        ? validProducts
        : validProducts.filter(p => p.category === activeCategory);

    const visibleProducts = filteredProducts.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
    };

    return (
        <main>
            <Navbar />

            <div className={`${styles.header} container`}>
                <div className={styles.saleBanner}>
                    <div className={styles.bannerContent}>
                        <span className={styles.bannerTag}>Limited Time Offer</span>
                        <h2>Spring Bloom Sale - 20% Off</h2>
                        <button className={`${styles.bannerBtn} btn`}>Shop Now</button>
                    </div>
                    <div className={styles.bannerArt}>🌿</div>
                </div>

                <div className={styles.filterSection}>
                    <div className={styles.categories}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.catBtn} ${activeCategory === cat ? styles.active : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <section className={`${styles.productGrid} container`}>
                {visibleProducts.length > 0 ? (
                    visibleProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onImageClick={(p) => setSelectedProduct(p)}
                        />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', width: '100%', padding: '2rem' }}>
                        No plants found in this category.
                    </div>
                )}
            </section>

            {visibleCount < filteredProducts.length && (
                <div className={styles.loadMoreContainer}>
                    <button className={styles.loadMoreBtn} onClick={handleLoadMore}>Load More</button>
                </div>
            )}

            {selectedProduct && (
                <div className={cardStyles.modal} onClick={() => setSelectedProduct(null)}>
                    <div className={cardStyles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={cardStyles.closeBtn} onClick={() => setSelectedProduct(null)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <img
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            className={cardStyles.modalImage}
                            loading="eager"
                        />
                        <div className={cardStyles.modalInfo}>
                            <h3>{selectedProduct.name}</h3>
                            <p>₹{selectedProduct.price} - Wholesale Price</p>
                            <a
                                href={`https://wa.me/919605088858?text=Hi, I'm interested in the ${selectedProduct.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cardStyles.contactBtn}
                                style={{ marginTop: '1rem' }}
                            >
                                Order via WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
