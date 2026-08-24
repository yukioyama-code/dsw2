export default async function broadcast(response, channel, eventBuilder, interval) {
    response.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });
    response.flushHeaders();

    response.write('retry: 10000\n\n');
    let count = 0;

    while (true) {
        if (count == channel.length) {
            await new Promise(resolve => setTimeout(resolve, interval));
        } else {
            response.write(`data: ${eventBuilder(channel, count)}\n\n`);
            count++;
        }
    }
}