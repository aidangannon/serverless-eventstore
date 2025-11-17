import { CosmosClient } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";
import { EventsRepository } from "../../application/ports";
import { Event } from "../../models";

const credential = new DefaultAzureCredential();
const client = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    aadCredentials: credential
});

const database = client.database("EventsService");
const container = database.container("EventsService");

async function add(event: Event): Promise<void>{
    await container.items.create(event);
};

const CosmosEventsRepository = {
    add: add
} satisfies EventsRepository;
