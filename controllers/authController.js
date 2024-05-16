const { comparePassword, hashPassword } = require('../config/bcrypt');
const generateToken = require('../config/generateToken');
const { errorResponse, successResponse, internalErrorResponse, notFoundResponse } = require('../config/response');
const { users } = require('../models');

// membuat sebuah register controller
async function register(req, res) {
    const { username, email, password } = req.body;
    try {
        // Check email sudah ada atau belum
        // jika sudah ada maka tidak boleh terisi kembali
        const existingEmail = await users.findOne({ where: { email } });
        if (existingEmail) {
            errorResponse(res, 'User already exists', 400);
        }

        // Jika belum ada, maka dibuat
        const hashedPassword = await hashPassword(password);

        // insert into users (usaername, email, password) values (?, ?, ?)
        const user = await users.create({
            username,
            email,
            password: hashedPassword
        });

        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        successResponse(res, 'Registered successfully', userResponse, 201);
    } catch (error) {
        console.error(error);
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
            id: user.id,
            username: user.username,
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
            attributes: ['id', 'username', 'email']
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