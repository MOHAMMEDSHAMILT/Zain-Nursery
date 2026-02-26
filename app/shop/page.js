'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import ProductCard from '../components/shop/ProductCard';
import styles from './page.module.css';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All Plants');
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error("API did not return an array:", data);
                    setProducts([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch products:", err);
                setLoading(false);
            });
    }, []);

    // Extract unique categories from products
    const validProducts = Array.isArray(products) ? products : [];
    const categories = ['All Plants', ...new Set(validProducts.filter(p => p && p.category).map(p => p.category))];

    const filteredProducts = Array.isArray(products)
        ? (activeCategory === 'All Plants' ? products : products.filter(p => p.category === activeCategory))
        : [];

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
                {loading ? (
                    <div style={{ textAlign: 'center', width: '100%', padding: '2rem' }}>
                        Loading freshness...
                    </div>
                ) : visibleProducts.length > 0 ? (
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
