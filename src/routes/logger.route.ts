import { Elysia } from "elysia";
import { loggerController } from "../controllers/logger.controller";
import { validateRequest } from "../middlewares/validation.middleware";

export const loggerRoutes = new Elysia({ prefix: '/api/logs' })
    .use(validateRequest)
    .get('/', 
        async ({ request }) => {
        const response = await loggerController.getAllLogs();
        return response;
        }
    )
        .get('/:id', 
            async ({ request, params }) => {
            const response = await loggerController.getLogByInformationId({ params });
            return response;
            }
        )
        .get('/log/:id', 
            async ({ request, params }) => {
            const response = await loggerController.getLogById({ params });
            return response;
            }
        )