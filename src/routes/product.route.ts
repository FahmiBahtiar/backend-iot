import { Elysia } from 'elysia';
import { userController } from '../controllers/product.controller';
import { validateRequest } from '../middlewares/validation.middleware';

export const userRoutes = new Elysia({ prefix: '/api/users' })
  .use(validateRequest)
  .get('/', 
    async ({ request }) => {
      const response = await userController.getAllUsers();
      return response;
    }
  )
  .get('/:id', 
    async ({ request, params }) => {
      const response = await userController.getUserById({ params });
      return response;
    }
  )
  .post('/', 
    async ({ request, body }) => {
      const response = await userController.createUser({ body });
      return response;
    },
    { body: 'user.create' }
  )
  .put('/:id', 
    async ({ request, params, body }) => {
      const response = await userController.updateUser({ params, body });
      return response;
    },
    { body: 'user.update' }
  )
  .delete('/:id', 
    async ({ request, params }) => {
      const response = await userController.deleteUser({ params });
      return response;
    }
  );