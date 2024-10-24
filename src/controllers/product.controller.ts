import { User } from '../models/product.model';
import { AppError } from '../middlewares/error.middleware';

export const userController = {
  // Get all users
  getAllUsers: async () => {
    const users = await User.find();
    if (!users) {
      throw new AppError(404, 'No users found');
    }
    return { status: 200, data: users };
  },

  // Get user by ID
  getUserById: async ({ params }: { params: { id: string } }) => {
    const user = await User.findById(params.id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return { status: 200, data: user };
  },

  // Create new user
  createUser: async ({ body }: { body: any }) => {
    const user = await User.create(body);
    return { status: 201, data: user };
  },

  // Update user
  updateUser: async ({ params, body }: { params: { id: string }, body: any }) => {
    const user = await User.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return { status: 200, data: user };
  },

  // Delete user
  deleteUser: async ({ params }: { params: { id: string } }) => {
    const user = await User.findByIdAndDelete(params.id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return { status: 200, message: 'User deleted successfully' };
  }
};