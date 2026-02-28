'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import ProductCard from '../components/shop/ProductCard';
import styles from './page.module.css';

export default function ShopClient({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts || []);
    const [activeCategory, setActiveCategory] = useState('All Plants');
    const [visibleCount, setVisibleCount] = useState(6);

    // Fetch full data (with images) on the client side to bypass Vercel's payload limits
    useEffect(() => {
        const fetchFullData = async () => {
            try {
                const res = await fetch('/api/products');
                const fullData = await res.json();
                if (Array.isArray(fullData)) {
                    // Update the state with full data including images
                    setProducts(fullData);
                }
            } catch (err) {
                console.error('Failed to load full product images:', err);
            }
        };
        fetchFullData();
    }, []);

    const validProducts = Array.isArray(products) ? products : [];

    // Extract unique categories from products
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
                        <ProductCard key={product.id} product={product} />
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
        </main>
    );
}
