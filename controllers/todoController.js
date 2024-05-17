const { successResponse, errorResponse, internalErrorResponse } = require('../config/response');
const { tasks, users } = require('../models')

const getTasks = async (req, res) => {
    try {
        const task = await tasks.findAll({
            where: {
                userId: req.user.id
            },
            include: [
                {
                    model: users,
                    as: 'user',
                    attributes: ['id', 'username', 'email']
                }
            ]
        });

        successResponse(res, 'Tasks fetched successfully', task, 200)
    } catch (err) {
        internalErrorResponse(res, err, 500);
    }
}

const createTask = async (req, res) => {
    const userId = req.user.id;
    const { title, description } = req.body;

    try {
        const task = await tasks.create({
            title,
            description,
            userId
        });

        if (!task) {
            errorResponse(res, 'Task not created', 400);
        } else {
            successResponse(res, 'Task created successfully', task, 201);
        }
    } catch (err) {
        internalErrorResponse(res, err, 500);
    }
}

const updateTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description } = req.body;

    try {
        const task = await tasks.findOne({
            where: {
                id,
                userId
            }
        });

        if (!task) {
            errorResponse(res, 'Task not found', 404);
        }
        const updatedTask = await tasks.update({
            title,
            description
        }, {
            where: {
                id,
                userId
            }
        });

        const taskReponse = {
            id: task.id,
            title: task.title,
            description: task.description
        }

        if (!updatedTask) {
            errorResponse(res, 'Task not updated', 400);
        } else {
            successResponse(res, 'Task updated successfully', taskReponse, 200);
        }
    } catch (err) {
        console.error(err);
        internalErrorResponse(res, err, 500);
    }
}

const showId = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;

    try {
        const task = await tasks.findOne({
            where: {
                id,
                userId
            },
            include: [
                {
                    model: users,
                    as: 'user',
                    attributes: ['id', 'username', 'email']
                }
            ]
        });
        if (!task) {
            errorResponse(res, 'Task not found', 404);
        } else {
            successResponse(res, 'Task fetched successfully', task, 200);
        }
    } catch (err) {
        internalErrorResponse(res, err, 500)
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const task = await tasks.findOne({
            where: {
                id,
                userId
            }
        });
        if (!task) {
            errorResponse(res, 'Task not found', 404);
        }

        const deletedTask = await tasks.destroy({
            where: {
                id,
                userId
            }
        });

        if (!deletedTask) {
            errorResponse(res, 'Task not deleted', 400);
        } else {
            successResponse(res, 'Task deleted successfully', tasks, 200);
        }
    } catch (err) {
        internalErrorResponse(res, err, 500)
    }
}
module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    showId
}