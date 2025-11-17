import { CosmosClient } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";

const credential = new DefaultAzureCredential();
const client = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    aadCredentials: credential
});

const database = client.database("EventsService");
const container = database.container("EventsService");

export default async function add(event: Event): Promise<void>{
    await container.items.create(event);
};

