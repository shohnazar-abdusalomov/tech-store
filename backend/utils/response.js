class ApiResponse {
    static success(res, data, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            data
        });
    }

    static error(res, message, statusCode = 500, errors = null) {
        const response = {
            success: false,
            error: message
        };
        if (errors) {
            response.errors = errors;
        }
        return res.status(statusCode).json(response);
    }

    static created(res, data) {
        return res.status(201).json({
            success: true,
            data
        });
    }

    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            success: false,
            error: message
        });
    }

    static unauthorized(res, message = 'Unauthorized') {
        return res.status(401).json({
            success: false,
            error: message
        });
    }

    static badRequest(res, message = 'Bad request', errors = null) {
        const response = {
            success: false,
            error: message
        };
        if (errors) {
            response.errors = errors;
        }
        return res.status(400).json(response);
    }
}

module.exports = ApiResponse;
