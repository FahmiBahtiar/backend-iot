import { Elysia } from 'elysia';

interface WebhookMessage {
  embeds: {
    title: string;
    description: string;
    color: number;
    fields?: {
      name: string;
      value: string;
    }[];
    timestamp?: string;
  }[];
}

export class DiscordLogger {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  async sendToDiscord(message: any) {
    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Failed to send log to Discord:', error);
    }
  }

  async logError(error: any, request?: any) {
    let errorTitle = 'Application Error';
    let errorColor = 0xFF0000; // Red color
    let errorDescription = error.message || 'Unknown error occurred';
    let fields = [];

    // Add timestamp
    const timestamp = new Date().toISOString();

    // Add request information if available
    if (request) {
      fields.push({
        name: 'Request Details',
        value: `Method: ${request.method}\nPath: ${request.path}\nIP: ${request.ip}`,
      });
    }

    // Handle specific error types
    if (error.code === 11000) {
      errorTitle = 'Duplicate Key Error';
      errorDescription = `Duplicate entry found for ${JSON.stringify(error.keyValue)}`;
    } else if (error.name === 'ValidationError') {
      errorTitle = 'Validation Error';
      errorDescription = Object.values(error.errors)
        .map((err: any) => err.message)
        .join('\n');
    } else if (error.name === 'CastError') {
      errorTitle = 'Invalid ID Error';
      errorDescription = 'Invalid ID format provided';
    }

    // Add error stack if available
    if (error.stack) {
      fields.push({
        name: 'Stack Trace',
        value: `\`\`\`${error.stack.substring(0, 1000)}\`\`\``, // Discord has a limit
      });
    }

    const webhookMessage: WebhookMessage = {
      embeds: [{
        title: errorTitle,
        description: errorDescription,
        color: errorColor,
        fields: fields,
        timestamp: timestamp
      }]
    };

    await this.sendToDiscord(webhookMessage);
  }

  async logInfo(message: string, data?: any) {
    const webhookMessage: WebhookMessage = {
      embeds: [{
        title: 'Info Log',
        description: message,
        color: 0x00FF00, // Green color
        fields: data ? [
          {
            name: 'Additional Data',
            value: `\`\`\`json\n${JSON.stringify(data, null, 2)}\`\`\``
          }
        ] : undefined,
        timestamp: new Date().toISOString()
      }]
    };

    await this.sendToDiscord(webhookMessage);
  }
}