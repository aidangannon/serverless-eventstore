import { app, InvocationContext } from '@azure/functions';
import { Event } from '../models';

app.serviceBusTopic('serviceTopicTrigger', {
    connection: 'ServiceBusConnection',
    topicName: 'PolyMapper.CreateEvent',
    subscriptionName: 'pollymapper-events',
    handler: (message: Event, context: InvocationContext) => {
        context.log('Processing message:', message);
    }
});
