import { Elysia } from 'elysia';

export const requestLogger = new Elysia()
  .derive(async ({ request, body, query, params }) => {
    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!webhook) {
      console.error('Discord webhook URL not configured');
      return;
    }

    const logToDiscord = async (data: any) => {
      try {
        const response = await fetch(webhook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          console.error('Failed to send to Discord:', await response.text());
        }
      } catch (error) {
        console.error('Error sending to Discord:', error);
      }
    };

    // Get request details
    const url = new URL(request.url);
    const requestData = {
      method: request.method,
      path: url.pathname,
      query: query || {},
      params: params || {},
      body: body || {},
      timestamp: new Date().toISOString(),
    };

    // Create Discord message
    const message = {
      embeds: [{
        title: `🔍 New Request: ${requestData.method} ${requestData.path}`,
        color: 0x00ff00,
        fields: [
          {
            name: 'Request Details',
            value: `Method: ${requestData.method}\nPath: ${requestData.path}\nTimestamp: ${requestData.timestamp}`
          },
          {
            name: 'Request Data',
            value: '```json\n' + JSON.stringify({
              query: requestData.query,
              params: requestData.params,
              body: requestData.body
            }, null, 2).slice(0, 1000) + '\n```'
          }
        ],
        timestamp: new Date().toISOString()
      }]
    };

    // Log immediately when request is received
    await logToDiscord(message);

    return {
      logResponse: async (statusCode: number, responseData: any) => {
        const responseMessage = {
          embeds: [{
            title: `✅ Response: ${requestData.method} ${requestData.path}`,
            color: statusCode >= 400 ? 0xff0000 : 0x00ff00,
            fields: [
              {
                name: 'Response Details',
                value: `Status Code: ${statusCode}\nPath: ${requestData.path}\nMethod: ${requestData.method}`
              },
              {
                name: 'Response Data',
                value: '```json\n' + JSON.stringify(responseData, null, 2).slice(0, 1000) + '\n```'
              }
            ],
            timestamp: new Date().toISOString()
          }]
        };

        await logToDiscord(responseMessage);
      }
    };
  });