import { Event } from "../models";

export interface EventsRepository {
    add(event: Event): Promise<void>;
    update(id: string, payload: Record<string, any>): Promise<void>; 
    deleteEvent(id: string): Promise<void>;
}
