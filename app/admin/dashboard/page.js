'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';


export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('inventory'); // Default to inventory since it's the core feature
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', category: 'Indoor', price: '', stock: '', image: '' });
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const router = useRouter();

    const [messages, setMessages] = useState([]);
    const [settings, setSettings] = useState({ storeName: '', adminEmail: '', currency: 'USD ($)' });
    const [saveStatus, setSaveStatus] = useState({ loading: false, success: false });

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin/login');
        } else {
            setIsAuthorized(true);
            fetchProducts();
            fetchMessages();
            fetchSettings();
        }
    }, [router]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                console.error("API did not return an array for products:", data);
                setProducts([]);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProducts([]);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages');
            const data = await res.json();
            if (Array.isArray(data)) {
                setMessages(data);
            } else {
                console.error("API did not return an array for messages:", data);
                setMessages([]);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            setMessages([]);
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const res = await fetch(`/api/messages?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchMessages();
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Failed to delete message');
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data && typeof data === 'object') {
                setSettings(data);
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSaveStatus({ loading: true, success: false });
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setSaveStatus({ loading: false, success: true });
                setTimeout(() => setSaveStatus({ loading: false, success: false }), 3000);
            }
        } catch (error) {
            setSaveStatus({ loading: false, success: false });
        }
    };

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        localStorage.removeItem('isAdmin');
        router.push('/admin/login');
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/products?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchProducts();
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const product = {
            name: newProduct.name,
            category: newProduct.category,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock),
            image: newProduct.image
        };

        if (isEditing) {
            product.id = currentProductId;
            const res = await fetch('/api/products', {
                method: 'PUT',
                body: JSON.stringify(product),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                fetchProducts();
                setIsEditing(false);
                setCurrentProductId(null);
                setNewProduct({ name: '', category: 'Indoor', price: '', stock: '', image: '' });
            }
        } else {
            const res = await fetch('/api/products', {
                method: 'POST',
                body: JSON.stringify(product),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                fetchProducts();
                setIsAdding(false);
                setNewProduct({ name: '', category: 'Indoor', price: '', stock: '', image: '' });
            }
        }
    };

    const handleEditClick = (product) => {
        setNewProduct({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            image: product.image || ''
        });
        setCurrentProductId(product.id);
        setIsEditing(true);
        setIsAdding(false);
    };

    const searchFilteredProducts = Array.isArray(products)
        ? products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const totalPages = Math.ceil(searchFilteredProducts.length / itemsPerPage) || 1;
    const paginatedProducts = searchFilteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset pagination when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const lowStockCount = Array.isArray(products) ? products.filter(p => p.stock < 15).length : 0;
    const activeCategories = Array.isArray(products) ? [...new Set(products.map(p => p.category))] : [];

    if (!isAuthorized) return null;

    return (
        <div className={styles.dashboard}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarBrand}>
                    <span className={styles.brandIcon}>🌿</span>
                    <h2>Bloom Admin</h2>
                </div>
                <nav className={styles.sidebarNav}>
                    <button
                        className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.active : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        📊 Dashboard
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'inventory' ? styles.active : ''}`}
                        onClick={() => setActiveTab('inventory')}
                    >
                        🪴 Inventory
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        📦 Orders
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'messages' ? styles.active : ''}`}
                        onClick={() => setActiveTab('messages')}
                    >
                        💬 Messages
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        ⚙️ Settings
                    </button>
                </nav>
                <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <div>
                        <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                        <p>Welcome back, Head Gardener</p>
                    </div>
                    {activeTab === 'inventory' && (
                        <div className={styles.headerActions}>
                            <button
                                className={`${styles.addBtn} btn btn-primary`}
                                onClick={() => setIsAdding(true)}
                            >
                                + Add Plant
                            </button>
                        </div>
                    )}
                </header>

                {activeTab === 'dashboard' && (
                    <section className={styles.stats}>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Total Products</span>
                            <span className={styles.statValue}>{products.length}</span>
                            <span className={styles.statTrend}>Live</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Low Stock Items</span>
                            <span className={styles.statValue}>{lowStockCount}</span>
                            <span className={styles.statTrend} style={{ color: lowStockCount > 0 ? '#ff4d4d' : 'var(--primary)' }}>
                                {lowStockCount > 0 ? 'Action Needed' : 'Healthy'}
                            </span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Active Categories</span>
                            <span className={styles.statValue}>{activeCategories.length}</span>
                            <span className={styles.statTrend}>{activeCategories.join(', ')}</span>
                        </div>
                    </section>
                )}

                {activeTab === 'inventory' && (
                    <>
                        {(isAdding || isEditing) && (
                            <section className={styles.addFormSection}>
                                <form className={styles.addForm} onSubmit={handleSubmit}>
                                    <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                                    <div className={styles.formGrid}>
                                        <input
                                            type="text"
                                            placeholder="Plant Name"
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                            required
                                        />
                                        <select
                                            value={newProduct.category}
                                            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        >
                                            <option value="Indoor">Indoor</option>
                                            <option value="Outdoor">Outdoor</option>
                                            <option value="Flower">Flower</option>
                                            <option value="Accessories">Accessories</option>
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            step="0.01"
                                            value={newProduct.price}
                                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Stock"
                                            value={newProduct.stock}
                                            onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                            required
                                        />
                                        <div className={styles.imageUpload}>
                                            <label className={styles.uploadLabel}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className={styles.fileInput}
                                                    onChange={handleFileChange}
                                                />
                                                {newProduct.image ? (
                                                    <div className={styles.imagePreview}>
                                                        <img src={newProduct.image} alt="Preview" />
                                                        <div className={styles.changeOverlay}>Change</div>
                                                    </div>
                                                ) : (
                                                    <div className={styles.uploadPlaceholder}>
                                                        <span className={styles.plusIcon}>+</span>
                                                        <span>Add Image</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                    <div className={styles.formActions}>
                                        <button type="submit" className="btn btn-primary">
                                            {isEditing ? 'Update Product' : 'Save Product'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setIsAdding(false); setIsEditing(false); setNewProduct({ name: '', category: 'Indoor', price: '', stock: '', image: '' }); }}
                                            className={styles.cancelBtn}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </section>
                        )}

                        <section className={styles.tableSection}>
                            <div className={styles.tableHeader}>
                                <input
                                    type="text"
                                    placeholder="Search plants..."
                                    className={styles.searchInput}
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Stock</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedProducts.map(p => (
                                        <tr key={p.id}>
                                            <td>
                                                <div className={styles.productCell}>
                                                    <div className={styles.productThumb}>
                                                        {p.image ? (
                                                            <img src={p.image} alt={p.name} className={styles.thumbImg} />
                                                        ) : (
                                                            '🪴'
                                                        )}
                                                    </div>
                                                    {p.name}
                                                </div>
                                            </td>
                                            <td>{p.category}</td>
                                            <td>
                                                <span className={`${styles.stockBadge} ${p.stock < 15 ? styles.lowStock : ''}`}>
                                                    {p.stock} in stock
                                                </span>
                                            </td>
                                            <td>${settings.currency.includes('₹') || settings.currency.includes('INR') ? '₹' : '$'}{p.price.toFixed(2)}</td>
                                            <td>
                                                <div className={styles.actionBtns}>
                                                    <button className={styles.editBtn} onClick={() => handleEditClick(p)}>Edit</button>
                                                    <button className={styles.deleteBtnIcon} onClick={() => handleDeleteProduct(p.id)} title="Delete Product">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className={styles.tableFooter}>
                                <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, searchFilteredProducts.length)} of {searchFilteredProducts.length} plants</span>
                                <div className={styles.pagination}>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    <button className={styles.activePage}>{currentPage}</button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {activeTab === 'orders' && (
                    <section className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📦</div>
                        <h3>No orders yet</h3>
                        <p>When customers buy plants, they will appear here.</p>
                    </section>
                )}

                {activeTab === 'messages' && (
                    <section className={styles.tableSection}>
                        <div className={styles.tableHeader}>
                            <h3>Customer Messages</h3>
                        </div>
                        {messages.length > 0 ? (
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Phone</th>
                                        <th>Message</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...messages].reverse().map(m => (
                                        <tr key={m.id}>
                                            <td>{new Date(m.timestamp).toLocaleDateString()}</td>
                                            <td>{m.fullName}</td>
                                            <td>{m.phoneNumber}</td>
                                            <td className={styles.messageCell}>{m.message}</td>
                                            <td>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDeleteMessage(m.id)}
                                                    title="Delete Message"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>💬</div>
                                <h3>No messages yet</h3>
                                <p>Questions from the Care Guide or Contact form will show up here.</p>
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'settings' && (
                    <section className={styles.settingsGrid}>
                        <form onSubmit={handleSaveSettings}>
                            <div className={styles.settingItem}>
                                <h4>Store Name</h4>
                                <input
                                    type="text"
                                    value={settings.storeName}
                                    onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                                />
                            </div>
                            <div className={styles.settingItem}>
                                <h4>Admin Email</h4>
                                <input
                                    type="email"
                                    value={settings.adminEmail}
                                    onChange={e => setSettings({ ...settings, adminEmail: e.target.value })}
                                />
                            </div>
                            <div className={styles.settingItem}>
                                <h4>Currency</h4>
                                <select
                                    value={settings.currency}
                                    onChange={e => setSettings({ ...settings, currency: e.target.value })}
                                >
                                    <option>INR (₹)</option>
                                    <option>USD ($)</option>
                                    <option>EUR (€)</option>
                                    <option>GBP (£)</option>
                                </select>
                            </div>
                            <div className={styles.settingsActions}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={saveStatus.loading}
                                >
                                    {saveStatus.loading ? 'Saving...' : 'Save Settings'}
                                </button>
                                {saveStatus.success && <span className={styles.successText}>✓ Saved!</span>}
                            </div>
                        </form>
                    </section>
                )}
            </main>
        </div>
    );
}
