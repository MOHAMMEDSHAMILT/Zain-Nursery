import { getData } from '../../lib/db';
import ShopClient from './ShopClient';

export default async function Shop() {
    // 1. Fetch products directly on the server
    // This makes the initial load instant as the data is included in the HTML
    let products = [];
    try {
        products = await getData('products.json');
    } catch (e) {
        console.error('Failed to fetch products on server:', e);
    }

    return <ShopClient initialProducts={products} />;
}
