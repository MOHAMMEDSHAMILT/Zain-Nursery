import { getData } from '../lib/db';
import HomeClient from './HomeClient';

export default async function Home() {
  // 1. Fetch data on the server
  // This removes the "Loading..." lag because data is part of the initial HTML
  let products = [];
  try {
    const data = await getData('products.json');
    if (Array.isArray(data)) {
      products = data.slice(0, 6).map(product => ({
        id: product.id,
        name: typeof product.name === 'string' ? product.name : 'Unknown Product',
        category: typeof product.category === 'string' ? product.category : 'Uncategorized',
        // Important: Exclude heavy Base64 image from initial props to stay under Vercel's payload limit (128KB)
        // Images will be lazy-loaded on the client side
        image: null,
        price: Number(product.price) || 0,
        stock: product.stock !== undefined ? Number(product.stock) : 0,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch products on server:', error);
  }

  return <HomeClient initialProducts={products} />;
}
