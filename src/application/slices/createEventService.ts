import { Event } from "../../models";
import { EventsRepository } from "../ports";

export default async function store(
    event: Event,
    eventStoreRepo: EventsRepository
): Promise<void> {
    await eventStoreRepo.add(event);
}
