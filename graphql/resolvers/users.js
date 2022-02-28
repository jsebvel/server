const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { SECRET_KEY } = require('../../config');

const { validateRegisterInput, validateLoginInput } = require('../../util/validatidators');

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '8h' });

}

module.exports = {
    Mutation: {
        async login(_, { email, password }) {
            const { errors, valid } = validateLoginInput(email, password);
            if (!valid) {
                throw new UserInputError('Wrong Credentials', { errors });
            }

            const user = await User.findOne({ email });

            if (!user) {
                errors.general = "User not found";
                throw new UserInputError('Can not find user', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = "Wrong Credentials";
                throw new UserInputError('Wrong Credentials', { errors });
            }

            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },


        async register(
            _,
            {
                registerInput: { username, email, password, confirmPassword }
            }
        ) {
            /* Validate user data */
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            /* Validate user exists */
            let user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }
            user = await User.findOne({ email })
            if (user) {
                throw new UserInputError('The email is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }
            /* Validate has password and create auth token */

            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toString()
            });

            const res = await newUser.save();

            const token = generateToken(res);
            return {
                ...res._doc,
                id: res._id,
                token
            }
        },

    }
}   