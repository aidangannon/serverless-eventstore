import { app, InvocationContext } from '@azure/functions';
import updateEventService from '../application/slices/updateEventService.ts';
import CosmosEventsRepository from '../infrastructure/adapters/cosmosEventsRepository';
import { Event } from '../models';

app.serviceBusTopic('serviceTopicTrigger', {
    connection: 'ServiceBusConnection',
    topicName: 'PolyMapper.UpdateEvent',
    subscriptionName: 'pollymapper-events',
    handler: (message: Event, context: InvocationContext) => {
        context.log('Processing message:', message);
        updateEventService.modify(message.id, message.payload, CosmosEventsRepository);
        context.log('Completed message:', message);
    }
});
