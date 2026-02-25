import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'app/data/settings.json');
import { isAuthenticated } from '../auth';

async function getSettings() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            storeName: "Zain Nursery",
            adminEmail: "admin@bloom.grow",
            currency: "INR (₹)"
        };
    }
}

async function saveSettings(settings) {
    await fs.writeFile(DATA_FILE, JSON.stringify(settings, null, 2));
}

export async function GET() {
    if (!await isAuthenticated()) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const settings = await getSettings();
        return Response.json(settings);
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
        await saveSettings(newSettings);
        return Response.json({ message: 'Settings saved successfully', data: newSettings });
    } catch (error) {
        return Response.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
