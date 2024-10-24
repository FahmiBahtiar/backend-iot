import { Elysia } from 'elysia';
import { DiscordLogger } from './discord.middleware';

const discordLogger = new DiscordLogger(process.env.DISCORD_WEBHOOK_URL || '');

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = new Elysia()
  .onError(async ({ code, error, set, request }) => {
    console.error(`Error: ${error.message}`);
    
    // Log error to Discord
    await discordLogger.logError(error, {
      method: request.method,
      path: request.url,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    });

    if (error instanceof AppError) {
      set.status = error.statusCode;
      return {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    }

    // MongoDB Duplicate Key Error
    if ('code' in error && typeof error.code === 'number' && error.code === 11000) {
      set.status = 400;
      return {
        success: false,
        error: 'Duplicate field value entered'
      };
    }

    // MongoDB Validation Error
    if (error.name === 'ValidationError') {
      set.status = 400;
      const errors = Object.values((error as any).errors).map((err: any) => err.message);
      return {
        success: false,
        error: errors
      };
    }

    // MongoDB Cast Error (Invalid ID)
    if (error.name === 'CastError') {
      set.status = 400;
      return {
        success: false,
        error: 'Resource not found'
      };
    }

    // Default Error
    set.status = 500;
    return {
      success: false,
      error: 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  });