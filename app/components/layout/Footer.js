'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ loading: false, success: false });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        setStatus({ loading: true, success: false });

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: 'Newsletter Subscriber',
                    phoneNumber: email,
                    message: `Subscribed to newsletter: ${email}`,
                    source: 'Newsletter'
                })
            });

            if (res.ok) {
                setStatus({ loading: false, success: true });
                setEmail('');
                setTimeout(() => setStatus({ loading: false, success: false }), 5000);
            }
        } catch (err) {
            setStatus({ loading: false, success: false });
        }
    };
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <span className="material-symbols-outlined text-primary">potted_plant</span>
                            <span className={styles.logoText}>Zain<span className="text-primary"> Nursery</span></span>
                        </div>
                        <p className={styles.description}>
                            Bringing the freshness of the wild into your urban life. We help you create your own green paradise.
                        </p>
                        <div className={styles.socials}>
                            <a href="#" className={styles.socialLink}>
                                <span className="material-symbols-outlined">social_leaderboard</span>
                            </a>
                            <a href="#" className={styles.socialLink}>
                                <span className="material-symbols-outlined">share</span>
                            </a>
                        </div>
                    </div>

                    <div className={styles.links}>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/shop">Shop Plants</Link></li>
                            <li><Link href="/care-guide">Care Tips</Link></li>
                            <li><Link href="/delivery">Delivery Info</Link></li>
                        </ul>
                    </div>

                    <div className={styles.links}>
                        <h4>Categories</h4>
                        <ul>
                            <li><Link href="/shop?cat=Indoor">Indoor Plants</Link></li>
                            <li><Link href="/shop?cat=Outdoor">Outdoor Garden</Link></li>
                            <li><Link href="/shop?cat=Succulents">Succulents</Link></li>
                            <li><Link href="/shop?cat=Pots">Pots & Tools</Link></li>
                        </ul>
                    </div>

                    <div className={styles.newsletter}>
                        <h4>Newsletter</h4>
                        <p>Get weekly care tips and special plant offers.</p>
                        <form className={styles.newsletterForm} onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button className="btn btn-primary" disabled={status.loading}>
                                {status.loading ? '...' : 'Join'}
                            </button>
                        </form>
                        {status.success && <p className={styles.successMsg} style={{ color: 'var(--primary)', size: '0.8rem', marginTop: '0.5rem' }}>✓ Subscribed!</p>}
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© 2025 Zain Nursery. All rights reserved.</p>
                    <div className={styles.bottomLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
