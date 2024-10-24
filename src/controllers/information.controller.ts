import { Information } from '../models/information.model';
import { AppError } from '../middlewares/error.middleware';
import { Logger } from '../models/logger.model';

export const informationController = {
  // Get all information
  getAllInformation: async () => {
    const information = await Information.find().sort({ createdAt: -1 });
    if (!information) {
      throw new AppError(404, 'No information found');
    }
    return { status: 200, data: information };
  },

  // Get information by ID
  getInformationById: async ({ params }: { params: { id: string } }) => {
    const information = await Information.findById(params.id);
    if (!information) {
      throw new AppError(404, 'Information not found');
    }
    return { status: 200, data: information };
  },

  // Create or update information based on time condition
  createInformation: async ({ body }: { body: any }) => {
    // Get the latest information
    const latestInformation = await Information.findOne().sort({ createdAt: -1 });

    // If no data exists, create new one
    if (!latestInformation) {
      const information = await Information.create({
        ...body,
        createdAt: new Date()
      });

      await Logger.create({
        action: 'create',
        informationId: information._id,
        description: 'New information created',
        newData: information
      });
      return { status: 201, data: information };
    }

    // Calculate time difference in minutes
    const timeDifference = (new Date().getTime() - latestInformation.createdAt.getTime()) / (1000 * 60);

    // If less than 10 minutes, update existing record
    if (timeDifference < 10) {
      const updatedInformation = await Information.findByIdAndUpdate(
        latestInformation._id,
        {
          ...body,
          updatedAt: new Date()
        },
        {
          new: true,
          runValidators: true
        }
      );

      if (!updatedInformation) {
        throw new AppError(500, 'Failed to update information');
      }

      await Logger.create({
        action: 'update',
        informationId: updatedInformation._id ,
        description: 'Information updated (within 10 minutes)',
        oldData: latestInformation,
        newData: updatedInformation
      });
      return { 
        status: 200, 
        data: updatedInformation,
        message: 'Information updated (within 10 minutes)'
      };
    }

    // If more than 10 minutes, create new record
    const newInformation = await Information.create({
      ...body,
      createdAt: new Date()
    });

    await Logger.create({
        action: 'create',
        informationId: newInformation._id,
        description: 'New information created (after 10 minutes)',
        newData: newInformation
      });

    return { 
      status: 201, 
      data: newInformation,
      message: 'New information created (after 10 minutes)'
    };
  },

  // Update information
  updateInformation: async ({ params, body }: { params: { id: string }, body: any }) => {
    const information = await Information.findByIdAndUpdate(
      params.id,
      {
        ...body,
        updatedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!information) {
      throw new AppError(404, 'Information not found');
    }

    await Logger.create({
        action: 'update',
        informationId: information._id,
        description: 'Information updated',
        oldData: information,
        newData: body
        });

    return { status: 200, data: information };
  },

  // Delete information
  deleteInformation: async ({ params }: { params: { id: string } }) => {
    const information = await Information.findByIdAndDelete(params.id);
    if (!information) {
      throw new AppError(404, 'Information not found');
    }

    await Logger.create({
        action: 'delete',
        informationId: information._id,
        description: 'Information deleted',
        oldData: information
        });

    return { status: 200, message: 'Information deleted successfully' };
  }
};