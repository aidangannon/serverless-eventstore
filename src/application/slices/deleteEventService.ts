import { EventsRepository } from "../ports";

async function deleteEvent(
    id: string,
    eventStoreRepo: EventsRepository
): Promise<void> {
    await eventStoreRepo.deleteEvent(id);
}

const deleteEventService = {
    deleteEvent: deleteEvent
};

export default deleteEventService;
