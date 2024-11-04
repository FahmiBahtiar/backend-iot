import { Context } from '@netlify/functions'
import { Elysia } from 'elysia'

const app = new Elysia()
// ... routes Anda ...

export const handler = async (event: any, context: Context) => {
  try {
    const request = new Request(`${event.rawUrl}`, {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body
    })

    const response = await app.handle(request)
    
    // Handle berbagai tipe response body
    let responseBody: string = ''
    
    if (response.body) {
      if (response.headers.get('content-type')?.includes('application/json')) {
        responseBody = typeof response.body === 'string' 
          ? response.body 
          : JSON.stringify(response.body)
      } else {
        // Handle non-JSON response
        responseBody = String(response.body)
      }
    }

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        ...Object.fromEntries(response.headers.entries())
      },
      body: responseBody
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}