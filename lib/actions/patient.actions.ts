/* eslint-disable @typescript-eslint/no-explicit-any */
import { users } from '@/lib/appwrite.config'
import { parseStringify } from '@/lib/utils'
import { ID, Query } from 'node-appwrite'

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
