/* eslint-disable @typescript-eslint/no-explicit-any */

'use server'

import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENTS_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from '@/lib/appwrite.config'
import { parseStringify } from '@/lib/utils'
import { ID, Query } from 'node-appwrite'
import { InputFile } from 'node-appwrite/file'

export async function createUser(user: CreateUserParams) {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.email,
    )

    return parseStringify(newUser)
  } catch (error: any) {
    console.log(error)
    if (error?.code === 409) {
      const documents = await users.list([Query.equal('email', [user.email])])

      return documents?.users[0]
    }
  }
}

export async function getUser(userId: string) {
  try {
    const user = await users.get(userId)

    return parseStringify(user)
  } catch (error: any) {
    console.log(error)
  }
}

export async function registerPatient({
  identificationDocument,
  ...patient
}: RegisterUserParams) {
  try {
    let file
    const blobFile = identificationDocument?.get('blobFile') as Blob
    const fileName = identificationDocument?.get('fileName') as string
    if (blobFile) {
      const inputFile = InputFile.fromBuffer(blobFile, fileName)
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENTS_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: file
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`
          : null,
        ...patient,
      },
    )
    return newPatient
  } catch (error) {
    console.log(error)
  }
}
