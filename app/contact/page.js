'use client';

import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import styles from './page.module.css';

export default function Contact() {
    const [formData, setFormData] = useState({ fullName: '', email: '', message: '' });
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
                body: JSON.stringify({
                    fullName: formData.fullName,
                    phoneNumber: formData.email, // Using email as phoneNumber field for consistency with API or maybe update API to accept email
                    message: formData.message,
                    source: 'Contact Page'
                })
            });

            if (res.ok) {
                setStatus({ loading: false, success: true, error: null });
                setFormData({ fullName: '', email: '', message: '' });
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

            <header className={styles.header}>
                <div className="container">
                    <h1>Get in Touch</h1>
                    <p>Have questions about your plants? We're here to help.</p>
                </div>
            </header>

            <section className={`${styles.contactSection} container`}>
                <div className={styles.formCard}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Message</label>
                            <textarea
                                name="message"
                                placeholder="Tell us about your garden..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1.25rem' }}
                            disabled={status.loading}
                        >
                            {status.loading ? 'Sending...' : 'Send Message'}
                        </button>

                        {status.success && <p className={styles.successMsg} style={{ color: 'var(--primary)', marginTop: '1rem', textAlign: 'center' }}>✓ Message sent successfully!</p>}
                        {status.error && <p className={styles.errorMsg} style={{ color: '#ff4d4d', marginTop: '1rem', textAlign: 'center' }}>{status.error}</p>}
                    </form>
                </div>

                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className="material-symbols-outlined">call</span>
                        <div>
                            <h4>Phone</h4>
                            <p>+91 9605088858</p>
                        </div>
                    </div>
                    <div className={styles.infoItem}>
                        <span className="material-symbols-outlined">mail</span>
                        <div>
                            <h4>Email</h4>
                            <p>Alikka@nurserygarden.com</p>
                        </div>
                    </div>
                    <div className={styles.infoItem}>
                        <span className="material-symbols-outlined">location_on</span>
                        <div>
                            <h4>Greenhouse</h4>
                            <p>Zain Nursery, Q3VW+PRM, Kundukad, Aloor, Kerala 679534</p>
                        </div>
                    </div>

                    <a
                        href="https://wa.me/919605088858"
                        target="_blank"
                        className={styles.waButton}
                    >
                        Chat with us on WhatsApp
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}
