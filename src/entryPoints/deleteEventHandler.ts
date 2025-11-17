import { app, InvocationContext } from '@azure/functions';
import deleteEventService from '../application/slices/deleteEventService';
import cosmosEventsRepository from '../infrastructure/adapters/cosmosEventsRepository';
import { Event } from '../models';

app.serviceBusTopic('serviceTopicTrigger', {
    connection: 'ServiceBusConnection',
    topicName: 'PolyMapper.DeleteEvent',
    subscriptionName: 'pollymapper-events',
    handler: (message: Event, context: InvocationContext) => {
        context.log('Processing message:', message);
        deleteEventService.deleteEvent(message.id, cosmosEventsRepository);
        context.log('Completed message:', message);
    }
});
