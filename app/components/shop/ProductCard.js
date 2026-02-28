import { useState } from 'react';
import Link from 'next/link';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className={styles.card}>
                <div className={styles.imageContainer} onClick={() => setIsModalOpen(true)}>
                    {product.badge && <span className={styles.badge}>{product.badge}</span>}
                    <img src={product.image} alt={product.name} className={styles.image} title="Click to view full image" />
                    <button className={styles.wishlistBtn} aria-label="Add to wishlist" onClick={(e) => e.stopPropagation()}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                    </button>
                    <div className={styles.viewOverlay}>
                        <span className="material-symbols-outlined">zoom_in</span>
                    </div>
                </div>
                <div className={styles.info}>
                    <span className={styles.category}>{product.category}</span>
                    <h3 className={styles.name}>{product.name}</h3>
                    <div className={styles.footer}>
                        <div className={styles.rateGroup}>
                            <span className={styles.price}>₹{typeof product.price === 'number' ? product.price.toFixed(2) : (parseFloat(product.price) || 0).toFixed(2)}</span>
                            <span className={styles.wholesaleLabel}>Wholesale Rate</span>
                        </div>
                        <a
                            href={`https://wa.me/919605088858?text=Hi, I'm interested in the ${product.name} (₹${product.price})`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.contactBtn}
                        >
                            Contact Us
                        </a>
                    </div>
                    <div className={styles.productStatus}>
                        <span className={styles.stockLabel}>📦 {product.stock || 0} in stock</span>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className={styles.modal} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <img src={product.image} alt={product.name} className={styles.modalImage} />
                        <div className={styles.modalInfo}>
                            <h3>{product.name}</h3>
                            <p>₹{product.price} - Wholesale Price</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
