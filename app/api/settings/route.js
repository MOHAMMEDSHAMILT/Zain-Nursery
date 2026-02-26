import { getData, saveData, getCollection } from '../../../lib/db';

export async function GET() {
    try {
        const settings = await getData('settings.json');
        // If MongoDB returns an array, return the first object
        if (Array.isArray(settings) && settings.length > 0) {
            return Response.json(settings[0]);
        }
        return Response.json(settings);
    } catch (error) {
        return Response.json({ error: 'Failed to load settings' }, { status: 500 });
    }
}

export async function POST(request) {
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
