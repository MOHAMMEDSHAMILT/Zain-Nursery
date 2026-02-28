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
        image: typeof product.image === 'string' ? product.image : '/images/placeholder.jpg',
        price: typeof product.price === 'number' || typeof product.price === 'string' ? parseFloat(product.price as string) : 0,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch products on server:', error);
  }

  return <HomeClient initialProducts={products} />;
}
