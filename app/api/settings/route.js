import { getData, saveData, getCollection } from '../../../lib/db';
import { isAuthenticated } from '../auth';

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
    try {
        const settings = await getData('settings.json');
        // If MongoDB returns an array, return the first object
        if (Array.isArray(settings) && settings.length > 0) {
            return Response.json(settings[0], {
                headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
            });
        }
        return Response.json(settings, {
            headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
        });
    } catch (error) {
        return Response.json({ error: 'Failed to load settings' }, { status: 500 });
    }
}

export async function POST(request) {
    if (!await isAuthenticated()) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const newSettings = await request.json();
        const settingsCollection = await getCollection('settings');

        if (settingsCollection) {
            // MongoDB Mode
            await settingsCollection.updateOne(
                {}, // Update any first document
                { $set: newSettings },
                { upsert: true }
            );
            return Response.json({ message: 'Settings saved successfully' });
        } else {
            // File Mode
            await saveData('settings.json', newSettings);
            return Response.json({ message: 'Settings saved successfully' });
        }
    } catch (error) {
        return Response.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
