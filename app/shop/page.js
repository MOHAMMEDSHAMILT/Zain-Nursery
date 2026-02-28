import { getData } from '../../lib/db';
import ShopClient from './ShopClient';

export default async function Shop() {
    // 1. Fetch products directly on the server
    // This makes the initial load instant as the data is included in the HTML
    let products = [];
    try {
        const rawProducts = await getData('products.json');
        if (Array.isArray(rawProducts)) {
            // Mapping here is CRITICAL to reduce prop size and prevent Vercel build failures
            products = rawProducts.map(p => ({
                id: p.id,
                name: p.name || 'Unnamed Plant',
                category: p.category || 'Other',
                price: Number(p.price) || 0,
                image: typeof p.image === 'string' ? p.image : '/images/placeholder.jpg',
                stock: p.stock !== undefined ? Number(p.stock) : 0
            }));
        }
    } catch (e) {
        console.error('Failed to fetch products on server:', e);
    }

    return <ShopClient initialProducts={products} />;
}
