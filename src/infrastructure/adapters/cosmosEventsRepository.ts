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


async function update(id: string, payload: Record<string, any>): Promise<void>{
    await container.item(id, id).patch([
        { op: "replace", path: "/payload", value: payload }
    ]);
};

const cosmosEventsRepository = {
    add: add,
    update: update
} satisfies EventsRepository;

export default cosmosEventsRepository;
