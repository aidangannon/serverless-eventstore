import { app, InvocationContext } from '@azure/functions';

app.serviceBusQueue('serviceBusQueueTrigger', {
    connection: 'ServiceBusConnection',
    queueName: 'myqueue',
    handler: (message: unknown, context: InvocationContext) => {
        context.log('Processing message:', message);
    }
});
