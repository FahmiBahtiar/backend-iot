import { Logger } from "../models/logger.model";
import { AppError } from "../middlewares/error.middleware";


export const loggerController = {

    //Get all logs
    getAllLogs: async () => {
        const logs = await Logger.find().sort({ timestamp: -1 }).populate('informationId', 'title description');
        if (!logs.length) {
            throw new AppError(404, 'No logs found');
        }
        return { status: 200, data: logs };
    },

    // Get log for specific information
    getLogByInformationId: async ({ params }: { params: { id: string } }) => {
        const logs = await Logger.find({ informationId: params.id }).sort({ timestamp: -1 }).populate('informationId', 'title description');
        if (!logs.length) {
            throw new AppError(404, 'No logs found for this information');
        }
        return { status: 200, data: logs };
    },

    //get specific log by id
    getLogById: async ({ params }: { params: { id: string } }) => {
        const log = await Logger.findById(params.id).populate('informationId', 'title description');
        if (!log) {
            throw new AppError(404, 'Log not found');
        }
        return { status: 200, data: log };
    },
}