import { Elysia } from "elysia";
import { informationController } from "../controllers/information.controller";
import { validateRequest } from "../middlewares/validation.middleware";

export const informationRoutes = new Elysia({ prefix: '/api/information' })
  .use(validateRequest)
  .get('/', 
    async ({ request }) => {
      const response = await informationController.getAllInformation();
      return response;
    }
  )
    .get('/:id', 
        async ({ request, params }) => {
        const response = await informationController.getInformationById({ params });
        return response;
        }
    )
    .post('/', 
        async ({ request, body }) => {
        const response = await informationController.createInformation({ body });
        return response;
        },
        { body: 'information.create' }
    )