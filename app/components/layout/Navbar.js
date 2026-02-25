'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <>
            <nav className={styles.navbar}>
                <div className={`${styles.container} container`}>
                    <Link href="/" className={styles.logo}>
                        <span className={`material-symbols-outlined ${styles.logoIcon}`}>potted_plant</span>
                        <span className={styles.logoText}>Zain<span className="text-primary"> Nursery</span></span>
                    </Link>

                    <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
                        <Link href="/" className={styles.navLink}>Home</Link>
                        <Link href="/shop" className={styles.navLink}>Shop</Link>

                        <div className={styles.centerAction}>
                            <button
                                className={styles.contactIconBtn}
                                onClick={() => setIsContactOpen(!isContactOpen)}
                                aria-label="Contact Numbers"
                            >
                                <span className="material-symbols-outlined">phone</span>
                                {isContactOpen && (
                                    <div className={styles.contactDropdown}>
                                        <a href="tel:9567629559" className={styles.phoneLink}>
                                            <span className="material-symbols-outlined">phone</span>
                                            9567629559
                                        </a>
                                        <a href="tel:9605088858" className={styles.phoneLink}>
                                            <span className="material-symbols-outlined">phone</span>
                                            9605088858
                                        </a>
                                    </div>
                                )}
                            </button>
                        </div>

                        <Link href="/care-guide" className={styles.navLink}>Care Guide</Link>
                        <Link href="/about" className={styles.navLink}>About</Link>

                    </div>

                    <div className={styles.actions}>
                        <button
                            className={styles.iconBtn}
                            aria-label="Search"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                            </svg>
                        </button>
                        <Link href="/shop" className={styles.iconBtn} aria-label="Cart">
                            <div className={styles.cartBadge}></div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                        </Link>
                        <Link href="/admin/login" className={styles.iconBtn} aria-label="Profile">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                        </Link>
                        <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d={isMenuOpen ? "M18 6L6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>

                {isSearchOpen && (
                    <div className={styles.searchOverlay}>
                        <div className={`container ${styles.searchContainer}`}>
                            <form onSubmit={handleSearch} className={styles.searchForm}>
                                <input
                                    type="text"
                                    placeholder="Search for plants..."
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="material-symbols-outlined">search</button>
                            </form>
                            <button className={styles.closeSearch} onClick={() => setIsSearchOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
