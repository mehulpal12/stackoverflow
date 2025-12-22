import { Client , Avatars, Databases, Storage, Users } from "node-appwrite"
import env from "@/env";

let client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Your API Endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!) // Your project ID
    .setKey(env.appwrite.apikey) // Your secret API key
;


const databases = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const users = new Users(client);


export { databases,avatars,storage,users}