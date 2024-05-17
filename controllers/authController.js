const generateToken = require('../config/generateToken');
const { comparePassword, hashPassword } = require('../config/bcrypt');
const { errorResponse, successResponse, internalErrorResponse, notFoundResponse } = require('../config/response');
const { users } = require('../models');


async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = await users.findOne({ where: { email } });
        if (existingUser) {
            errorResponse(res, 'User already exists', 400);
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUser = await users.create({
            name,
            email,
            password: hashedPassword
        });

        const userResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

        successResponse(res, 'User registered successfully', userResponse, 201);
    } catch (error) {
        internalErrorResponse(res, error);
    }
};

async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await users.findOne({ where: { email } });
        if (!user) {
            notFoundResponse(res, 'User not found');
        }

        // Validate password
        const validPassword = await comparePassword(password, user.password);
        if (!validPassword) {
            errorResponse(res, 'Invalid password', 401);
        }

        const userResponse = {
            id: user,
            name: user.name,
            email: user.email,
        };

        const token = generateToken(user);
        successResponse(res, 'Logged in successfully', {
            user: userResponse,
            token
        }, 200);
    } catch (error) {
        console.error('Error logging in user:', error);
        internalErrorResponse(res, error);
    }
};

async function me(req, res) {
    try {
        const user = await users.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email']
        });
        if (!user) {
            errorResponse(res, 'User not found', 404);
        }
        successResponse(res, 'User fetched successfully', user, 200);
    } catch (error) {
        console.error('Error fetching user:', error);
        internalErrorResponse(res, error);
    }
};

async function logout(req, res) {
    try {
        successResponse(res, 'Logged out successfully', null, 200);
    } catch (error) {
        console.error('Error logging out user:', error);
        internalErrorResponse(res, error);
    }
};

module.exports = {
    register,
    login,
    me,
    logout,
}