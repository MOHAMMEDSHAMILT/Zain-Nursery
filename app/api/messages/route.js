import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'app/data/messages.json');
import { isAuthenticated } from '../auth';

async function getMessages() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveMessages(messages) {
    await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2));
}

export async function GET() {
    if (!await isAuthenticated()) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const messages = await getMessages();
        return Response.json(messages);
    } catch (error) {
        return Response.json({ error: 'Failed to load messages' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const newMessage = await request.json();
        const messages = await getMessages();

        const messageWithId = {
            ...newMessage,
            id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
            timestamp: new Date().toISOString()
        };

        messages.push(messageWithId);
        await saveMessages(messages);

        return Response.json({ message: 'Message sent successfully', data: messageWithId }, { status: 201 });
    } catch (error) {
        return Response.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

export async function DELETE(request) {
    if (!await isAuthenticated()) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id'));

        if (!id) {
            return Response.json({ error: 'Message ID is required' }, { status: 400 });
        }

        const messages = await getMessages();
        const filteredMessages = messages.filter(m => m.id !== id);

        if (messages.length === filteredMessages.length) {
            return Response.json({ error: 'Message not found' }, { status: 404 });
        }

        await saveMessages(filteredMessages);
        return Response.json({ message: 'Message deleted successfully' });
    } catch (error) {
        return Response.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
