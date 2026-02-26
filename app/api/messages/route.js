import { getData, saveData, getCollection } from '../../../lib/db';
import { isAuthenticated } from '../auth';

export async function GET() {
    if (!await isAuthenticated()) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const messages = await getData('messages.json');
        return Response.json(messages);
    } catch (error) {
        return Response.json({ error: 'Failed to load messages' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const newMessage = await request.json();
        const messagesCollection = await getCollection('messages');

        if (messagesCollection) {
            // MongoDB Mode
            const lastMessage = await messagesCollection.find().sort({ id: -1 }).limit(1).toArray();
            const nextId = lastMessage.length > 0 ? lastMessage[0].id + 1 : 1;

            const messageWithId = {
                ...newMessage,
                id: nextId,
                timestamp: new Date().toISOString()
            };

            await messagesCollection.insertOne(messageWithId);
            return Response.json({ message: 'Message sent successfully', data: messageWithId }, { status: 201 });
        } else {
            // File Mode
            const messages = await getData('messages.json');
            const messageWithId = {
                ...newMessage,
                id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
                timestamp: new Date().toISOString()
            };
            messages.push(messageWithId);
            await saveData('messages.json', messages);
            return Response.json({ message: 'Message sent successfully', data: messageWithId }, { status: 201 });
        }
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

        if (!id) return Response.json({ error: 'Message ID is required' }, { status: 400 });

        const messagesCollection = await getCollection('messages');
        if (messagesCollection) {
            // MongoDB Mode
            const result = await messagesCollection.deleteOne({ id });
            if (result.deletedCount === 0) return Response.json({ error: 'Message not found' }, { status: 404 });
            return Response.json({ message: 'Message deleted successfully' });
        } else {
            // File Mode
            const messages = await getData('messages.json');
            const filteredMessages = messages.filter(m => m.id !== id);
            if (messages.length === filteredMessages.length) return Response.json({ error: 'Message not found' }, { status: 404 });
            await saveData('messages.json', filteredMessages);
            return Response.json({ message: 'Message deleted successfully' });
        }
    } catch (error) {
        return Response.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
