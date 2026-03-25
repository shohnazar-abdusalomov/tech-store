const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
    generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username
        };

        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }

    async register(userData) {
        try {
            const { email, username, password } = userData;

            if (!email || !password || !username) {
                return {
                    success: false,
                    error: 'Email, username and password are required',
                    statusCode: 400
                };
            }

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return {
                    success: false,
                    error: 'Email already registered',
                    statusCode: 409
                };
            }

            const user = await User.create({ email, username, password });
            const token = this.generateToken(user);

            return {
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username
                    },
                    token
                },
                statusCode: 201
            };
        } catch (error) {
            throw new Error(`Failed to register user: ${error.message}`);
        }
    }

    async login(credentials) {
        try {
            const { email, password } = credentials;

            if (!email || !password) {
                return {
                    success: false,
                    error: 'Email and password are required',
                    statusCode: 400
                };
            }

            const user = await User.findByEmail(email);
            if (!user) {
                return {
                    success: false,
                    error: 'Invalid credentials',
                    statusCode: 401
                };
            }

            const isMatch = await User.comparePassword(password, user.password);
            if (!isMatch) {
                return {
                    success: false,
                    error: 'Invalid credentials',
                    statusCode: 401
                };
            }

            const token = this.generateToken(user);

            return {
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username
                    },
                    token
                }
            };
        } catch (error) {
            throw new Error(`Failed to login: ${error.message}`);
        }
    }

    async getUserById(id) {
        try {
            const user = await User.findById(id);
            if (!user) {
                return {
                    success: false,
                    error: 'User not found',
                    statusCode: 404
                };
            }
            return {
                success: true,
                data: user
            };
        } catch (error) {
            throw new Error(`Failed to fetch user: ${error.message}`);
        }
    }
}

module.exports = new AuthService();
