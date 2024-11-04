import { Context } from '@netlify/functions'
import app from '../../src'  // Import app dari index.ts

export const handler = async (event: any, context: Context) => {
  try {
    const request = new Request(event.rawUrl, {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body
    })

    const response = await app.handle(request)
    const body = await response.text()

    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: body
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    }
  }
}