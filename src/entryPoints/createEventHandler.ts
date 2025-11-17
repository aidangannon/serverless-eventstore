import { app, InvocationContext } from '@azure/functions';
import createEventService from '../application/slices/createEventService';
import cosmosEventsRepository from '../infrastructure/adapters/cosmosEventsRepository';
import { Event } from '../models';

app.serviceBusTopic('serviceTopicTrigger', {
    connection: 'ServiceBusConnection',
    topicName: 'PolyMapper.CreateEvent',
    subscriptionName: 'pollymapper-events',
    handler: (message: Event, context: InvocationContext) => {
        context.log('Processing message:', message);
        createEventService.store(message, cosmosEventsRepository);
        context.log('Completed message:', message);
    }
});
