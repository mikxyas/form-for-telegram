import { Account, Client, Databases, Functions, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

export const database = new Databases(client);
export const account = new Account(client);
export const functions = new Functions(client);
export const storage = new Storage(client);
