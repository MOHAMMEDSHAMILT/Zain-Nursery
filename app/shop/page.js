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
                // Important: Exclude heavy Base64 image from initial props to stay under Vercel's payload limit (128KB)
                // Images will be lazy-loaded on the client side
                image: null,
                stock: p.stock !== undefined ? Number(p.stock) : 0
            }));
        }
    } catch (e) {
        console.error('Failed to fetch products on server:', e);
    }

    return <ShopClient initialProducts={products} />;
}
