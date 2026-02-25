'use client';

import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import styles from './page.module.css';
export default function About() {
    const [formData, setFormData] = useState({ fullName: '', phoneNumber: '', message: '' });
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus({ loading: false, success: true, error: null });
                setFormData({ fullName: '', phoneNumber: '', message: '' });
                setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (err) {
            setStatus({ loading: false, success: false, error: 'Something went wrong. Please try again.' });
        }
    };

    return (
        <main>
            <Navbar />

            <section className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <div className={`${styles.heroContent} container`}>
                    <span className={styles.badge}>Premium Nursery</span>
                    <div className={styles.rating}>★ 4.9 (120 Reviews)</div>
                    <h1 className={styles.heroTitle}>Zain Nursery</h1>
                    <div className={styles.heroNav}>
                        <button className={`${styles.heroBtn} ${styles.active}`}>About</button>
                        <button className={styles.heroBtn}>Services</button>
                        <button className={styles.heroBtn}>Contact</button>
                    </div>
                </div>
            </section>

            <section className={`${styles.storySection} container`}>
                <div className={styles.storyHeader}>
                    <div className={styles.line}></div>
                    <h2>Our Story</h2>
                </div>
                <p className={styles.storyText}>
                    Founded with a passion for nature, Zain Nursery has grown from a humble collection into a leading horticultural destination in Kundukad. We are dedicated to bringing the pure essence of nature into urban living spaces across Kerala.
                </p>

                <div className={styles.missionVision}>
                    <div className={styles.mvCard}>
                        <div className={styles.mvIcon}>🚀</div>
                        <h3>Our Mission</h3>
                        <p>To inspire every home to host its own ecosystem through sustainable gardening practices.</p>
                    </div>
                    <div className={styles.mvCard}>
                        <div className={styles.mvIcon}>👁️</div>
                        <h3>Our Vision</h3>
                        <p>Transforming urban landscapes into lush, breathable havens for future generations.</p>
                    </div>
                </div>
            </section>

            <section className={`${styles.whatWeDo} container`}>
                <div className={styles.storyHeader}>
                    <div className={styles.line}></div>
                    <h2>What We Do</h2>
                </div>

                <div className={styles.serviceList}>
                    <div className={styles.serviceItem}>
                        <div className={styles.serviceThumb}>🏞️</div>
                        <div className={styles.serviceInfo}>
                            <h4>Landscaping</h4>
                            <p>Custom designs tailored to your architecture and local climate.</p>
                        </div>
                    </div>
                    <div className={styles.serviceItem}>
                        <div className={styles.serviceThumb}>🌿</div>
                        <div className={styles.serviceInfo}>
                            <h4>Plant Care</h4>
                            <p>Pruning, fertilizing, and seasonal maintenance for longevity.</p>
                        </div>
                    </div>
                    <div className={styles.serviceItem}>
                        <div className={styles.serviceThumb}>🏡</div>
                        <div className={styles.serviceInfo}>
                            <h4>Garden Setup</h4>
                            <p>Urban balconies and vertical green walls for compact living.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${styles.contactSection} container`}>
                <div className={styles.storyHeader}>
                    <div className={styles.line}></div>
                    <h2>Get In Touch</h2>
                </div>

                <div className={styles.contactGrid}>
                    <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>
                            <span className={styles.cIcon}>📍</span>
                            <div>
                                <h5>Visit Us</h5>
                                <p>Zain Nursery, Q3VW+PRM, Kundukad, Aloor, Kerala 679534</p>
                            </div>
                        </div>
                        <div className={styles.contactItem}>
                            <span className={styles.cIcon}>📞</span>
                            <div>
                                <h5>Call Us</h5>
                                <p>+91 9605088858</p>
                            </div>
                        </div>
                        <div className={styles.contactItem}>
                            <span className={styles.cIcon}>✉️</span>
                            <div>
                                <h5>Email Us</h5>
                                <p>admin@bloom.grow</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.contactCard}>
                        <form className={styles.contactForm} onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="User Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="+1 (000) 000-0000"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Message</label>
                                <textarea
                                    name="message"
                                    placeholder="How can we help you grow?"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={status.loading}
                            >
                                {status.loading ? 'Sending...' : 'Send Message ➤'}
                            </button>

                            {status.success && <p className={styles.successMsg}>✓ Message sent successfully!</p>}
                            {status.error && <p className={styles.errorMsg}>{status.error}</p>}
                        </form>
                    </div>
                </div>
            </section>


            <footer className={styles.aboutFooter}>
                <div className={styles.mapContainer}>
                    <div className={styles.mapPulse}>📍</div>
                    <span className={styles.mapLabel}>Zain Nursery Headquarters</span>
                </div>
            </footer>
        </main>
    );
}
