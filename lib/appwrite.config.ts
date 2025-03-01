import * as sdk from 'node-appwrite'

export const {
  PROJECT_ID,
  API_KEY,
  ENDPOINT,
  BUCKET_ID,
  DATABASE_ID,
  PATIENTS_COLLECTION_ID,
} = process.env

const client = new sdk.Client()

client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!)

export const databases = new sdk.Databases(client)
export const storage = new sdk.Storage(client)
export const users = new sdk.Users(client)
export const messaging = new sdk.Messaging(client)
