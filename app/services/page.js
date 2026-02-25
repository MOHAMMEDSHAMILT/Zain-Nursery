'use client';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import styles from './page.module.css';

export default function Services() {
    const services = [
        {
            icon: 'eco',
            title: 'Garden Design',
            description: 'Custom landscape design for homes and offices tailored to your space and light conditions.'
        },
        {
            icon: 'source_environment',
            title: 'Plant Maintenance',
            description: 'Weekly or monthly care services including watering, pruning, and organic fertilization.'
        },
        {
            icon: 'potted_plant',
            title: 'Indoor Installations',
            description: 'Transform your indoor spaces with professional plant wall installations and groupings.'
        },
        {
            icon: 'psychology',
            title: 'Plant Doctor',
            description: 'Professional consultation for struggling plants. We diagnose pests, diseases, and environment issues.'
        }
    ];

    return (
        <main>
            <Navbar />

            <header className={styles.header}>
                <div className="container">
                    <h1>Botanical Services</h1>
                    <p>Building your green paradise with expert care and design.</p>
                </div>
            </header>

            <section className={`${styles.servicesGrid} container`}>
                {services.map((service, index) => (
                    <div key={index} className={styles.serviceCard}>
                        <div className={styles.iconWrapper}>
                            <span className="material-symbols-outlined">{service.icon}</span>
                        </div>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <button className={styles.learnMore}>Learn More</button>
                    </div>
                ))}
            </section>

            <Footer />
        </main>
    );
}
