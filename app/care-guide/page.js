'use client';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import styles from './page.module.css';

const CARE_GUIDES = [
    {
        id: 'monstera',
        title: 'Monstera Deliciosa',
        sub: 'Swiss Cheese Plant',
        stats: [
            { label: 'Water', value: 'Weekly', icon: '💧', iconColor: '#0ea5e9' },
            { label: 'Light', value: 'Indirect', icon: '☀️', iconColor: '#f59e0b' },
            { label: 'Temp', value: '18-30°C', icon: '🌡️', iconColor: '#ef4444' }
        ],
        instructions: [
            'Check soil moisture: Insert finger 2 inches. If dry, water.',
            'Filtered Water: Use room temperature water to avoid sensitivity.',
            'Clean the leaves: Wipe with a damp cloth to remove dust.'
        ],
        image: null // The template uses a specific design without a header image
    },
    {
        id: 'jackfruit',
        title: 'Jackfruit Tree',
        sub: 'Artocarpus heterophyllus',
        stats: [
            { label: 'Water', value: '2-3 times/week', icon: '💧', iconColor: '#0ea5e9' },
            { label: 'Light', value: 'Full Sun', icon: '☀️', iconColor: '#f59e0b' },
            { label: 'Temp', value: '25-35°C', icon: '🌡️', iconColor: '#ef4444' }
        ],
        instructions: [
            'Deep Watering: Ensure the soil is moist but not waterlogged.',
            'Sunlight: Needs at least 6-8 hours of direct sunlight.',
            'Fertilization: Apply organic compost every 3-4 months.'
        ],
        image: '/images/care_guide_extra.jpg' // Using the tree photo provided
    }
];

export default function CareGuide() {
    return (
        <main>
            <Navbar />

            <div className={styles.page}>
                <div className="container">
                    <h1 className={styles.title}>Care Guide</h1>

                    <div className={styles.grid}>
                        {CARE_GUIDES.map((plant) => (
                            <div key={plant.id} className={styles.card}>
                                <div className={styles.tag}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>sell</span>
                                </div>

                                {plant.image && (
                                    <div className={styles.imageSection}>
                                        <img src={plant.image} alt={plant.title} className={styles.plantImage} />
                                    </div>
                                )}

                                <div className={styles.header}>
                                    <h2 className={styles.plantName}>{plant.title}</h2>
                                    <p className={styles.scientificBrief}>{plant.sub}</p>
                                </div>

                                <div className={styles.statsGrid}>
                                    {plant.stats.map((stat, idx) => (
                                        <div key={idx} className={styles.statCard}>
                                            <div className={styles.statIcon} style={{ fontSize: '24px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                                                {stat.icon}
                                            </div>
                                            <div className={styles.statLabel}>{stat.label}</div>
                                            <div className={styles.statValue}>{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.instructionsHeader}>
                                    <div className={styles.indicator}></div>
                                    <h3 className={styles.instructionsTitle}>Care Instructions</h3>
                                </div>

                                <div className={styles.instructionList}>
                                    {plant.instructions.map((text, idx) => (
                                        <div key={idx} className={styles.instructionItem}>
                                            <div className={styles.stepNumber}>{idx + 1}</div>
                                            <div className={styles.instructionText}>{text}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
