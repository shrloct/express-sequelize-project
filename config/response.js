const successResponse = (res, message, data) => {
    return res.status(200).json({ success: true, message, data });
};

const errorResponse = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({ success: false, message });
};

const validationErrorResponse = (res, errors) => {
    return res.status(400).json({ success: false, errors, message: 'Validation errors' });
};

const notFoundResponse = (res, message) => {
    return res.status(404).json({ success: false, message });
};

const internalErrorResponse = (res, message) => {
    return res.status(500).json({ success: false, message });
};

module.exports = {
    successResponse,
    errorResponse,
    validationErrorResponse,
    notFoundResponse,
    internalErrorResponse
};