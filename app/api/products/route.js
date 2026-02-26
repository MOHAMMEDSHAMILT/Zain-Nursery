import { getData, saveData, getCollection } from '../../../lib/db';
import { isAuthenticated } from '../auth';

export async function GET() {
    try {
        const products = await getData('products.json');
        return Response.json(products);
    } catch (error) {
        return Response.json({ error: 'Failed to load products' }, { status: 500 });
    }
}

export async function POST(request) {
    if (!await isAuthenticated()) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const newProduct = await request.json();
        const productsCollection = await getCollection('products');

        if (productsCollection) {
            // MongoDB Mode
            const lastProduct = await productsCollection.find().sort({ id: -1 }).limit(1).toArray();
            const nextId = lastProduct.length > 0 ? lastProduct[0].id + 1 : 1;

            const productWithId = {
                ...newProduct,
                id: nextId,
                image: newProduct.image || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            };

            await productsCollection.insertOne(productWithId);
            return Response.json({ message: 'Product added successfully', product: productWithId }, { status: 201 });
        } else {
            // File Mode
            const products = await getData('products.json');
            const productWithId = {
                ...newProduct,
                id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                image: newProduct.image || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            };
            products.push(productWithId);
            await saveData('products.json', products);
            return Response.json({ message: 'Product added successfully', product: productWithId }, { status: 201 });
        }
    } catch (error) {
        console.error('API POST Error:', error);
        return Response.json({ error: 'Failed to add product' }, { status: 500 });
    }
}

export async function PUT(request) {
    if (!await isAuthenticated()) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const updatedProduct = await request.json();
        const productsCollection = await getCollection('products');

        if (productsCollection) {
            // MongoDB Mode
            const result = await productsCollection.findOneAndUpdate(
                { id: updatedProduct.id },
                { $set: updatedProduct },
                { returnDocument: 'after' }
            );
            if (!result) return Response.json({ error: 'Product not found' }, { status: 404 });
            return Response.json({ message: 'Product updated successfully', product: result });
        } else {
            // File Mode
            const products = await getData('products.json');
            const index = products.findIndex(p => p.id === updatedProduct.id);
            if (index === -1) return Response.json({ error: 'Product not found' }, { status: 404 });
            products[index] = { ...products[index], ...updatedProduct };
            await saveData('products.json', products);
            return Response.json({ message: 'Product updated successfully', product: products[index] });
        }
    } catch (error) {
        console.error('API PUT Error:', error);
        return Response.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request) {
    if (!await isAuthenticated()) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id'));

        if (!id) return Response.json({ error: 'Product ID is required' }, { status: 400 });

        const productsCollection = await getCollection('products');
        if (productsCollection) {
            // MongoDB Mode
            const result = await productsCollection.deleteOne({ id });
            if (result.deletedCount === 0) return Response.json({ error: 'Product not found' }, { status: 404 });
            return Response.json({ message: 'Product deleted successfully' });
        } else {
            // File Mode
            const products = await getData('products.json');
            const filteredProducts = products.filter(p => p.id !== id);
            if (products.length === filteredProducts.length) return Response.json({ error: 'Product not found' }, { status: 404 });
            await saveData('products.json', filteredProducts);
            return Response.json({ message: 'Product deleted successfully' });
        }
    } catch (error) {
        return Response.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
