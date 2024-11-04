import { Context } from '@netlify/functions'
import { Elysia } from 'elysia'

const app = new Elysia()
// ... kode router Elysia Anda ...

export const handler = async (event: any, context: Context) => {
  const response = await app.handle(event)
  
  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: response.body
  }
}