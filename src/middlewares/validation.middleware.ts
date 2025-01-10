import { Elysia, t } from 'elysia';

export const validateRequest = new Elysia()
  .model({
    'user.create': t.Object({
      name: t.String({
        minLength: 2,
        maxLength: 50,
        error: 'Name must be between 2 and 50 characters'
      }),
      email: t.String({
        format: 'email',
        error: 'Invalid email format'
      }),
      age: t.Number({
        minimum: 0,
        maximum: 120,
        error: 'Age must be between 0 and 120'
      })
    }),
    'user.update': t.Object({
      name: t.Optional(t.String({
        minLength: 2,
        maxLength: 50
      })),
      email: t.Optional(t.String({
        format: 'email'
      })),
      age: t.Optional(t.Number({
        minimum: 0,
        maximum: 120
      }))
    }),

    'information.update': t.Object({
      state: t.Object({
        manualMode: t.Optional(t.Boolean({
          default: false,
        })),
        relay: t.Optional(t.Boolean({
          default: false,
        })),
      }),
      distance: t.Optional(t.Number({
        minimum: 0,
        maximum: 500
      })),
      level: t.Optional(t.Number({
        minimum: 0,
        maximum: 100
      })),
      temperature: t.Optional(t.String({
        minLength: 2,
        maxLength: 50
      })),
      timestamp: t.Optional(t.Date())
    }),

    'information.create': t.Object({
      state: t.Object({
        manualMode: t.Optional(t.Boolean({
          default: false,
        })),
        relay: t.Optional(t.Boolean({
          default: false,
        })),
      }),
      distance: t.Number({
        minimum: 0,
        maximum: 500,
        error: 'Distance must be between 0 and 500'
      }),
      level: t.Number({
        minimum: 0,
        maximum: 100,
        error: 'Level must be between 0 and 100'
      }),
      temperature: t.String({
        minLength: 2,
        maxLength: 50,
        error: 'Temperature must be between 2 and 50 characters'
      }),
    })

  });
