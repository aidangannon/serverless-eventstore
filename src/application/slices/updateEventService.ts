import { EventsRepository } from "../ports";

async function modify(
    id: string,
    payload: Record<string, any>,
    eventStoreRepo: EventsRepository
): Promise<void> {
    await eventStoreRepo.update(id, payload);
}

const updateEventService = {
    modify: modify
};

export default updateEventService;
