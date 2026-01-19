import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, Clock, LayoutDashboard } from 'lucide-react';
import './Features.css';

const Features = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const features = [
        {
            icon: <CheckCircle2 size={48} />,
            iconBg: '#EEF2FF',
            iconColor: '#667eea',
            title: 'Raise Complaints',
            description: 'Submit complaints easily with detailed descriptions and attachments. Our intuitive interface makes reporting issues quick and hassle-free.',
            items: ['Quick submission form', 'Attach photos & documents', 'Categorize by type'],
        },
        {
            icon: <Clock size={48} />,
            iconBg: '#FEF3C7',
            iconColor: '#F59E0B',
            title: 'Track Complaint Status',
            description: 'Monitor your complaints in real-time with live status updates. Get notified when your complaint is being addressed or resolved.',
            items: ['Real-time updates', 'Status notifications', 'Complaint history'],
        },
        {
            icon: <LayoutDashboard size={48} />,
            iconBg: '#DBEAFE',
            iconColor: '#3B82F6',
            title: 'Admin Resolution Panel',
            description: 'Comprehensive dashboard for administrators to manage, prioritize, and resolve complaints efficiently with powerful tools.',
            items: ['Centralized dashboard', 'Priority management', 'Analytics & reports'],
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section className="features" id="features" ref={ref}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">Everything You Need</h2>
                    <p className="section-subtitle">Powerful features to manage hostel complaints efficiently</p>
                </motion.div>

                <motion.div
                    className="features-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="feature-card"
                            variants={cardVariants}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <motion.div
                                className="feature-icon"
                                style={{ backgroundColor: feature.iconBg }}
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div style={{ color: feature.iconColor }}>
                                    {feature.icon}
                                </div>
                            </motion.div>

                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>

                            <ul className="feature-list">
                                {feature.items.map((item, itemIndex) => (
                                    <motion.li
                                        key={itemIndex}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                        transition={{ delay: index * 0.2 + itemIndex * 0.1 + 0.3 }}
                                    >
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
