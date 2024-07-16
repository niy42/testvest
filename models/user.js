'use strict';
const { Model, DataTypes, Op } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Model {
        static associate(models) {
            // Define associations here if needed
        }

        static async isEmailTaken(email, excludeUserId) {
            const user = await this.findOne({
                where: {
                    email,
                    id: {
                        [Op.ne]: excludeUserId
                    }
                }
            });
            return user;
        }

        static async isPasswordMatch(password, hash) {
            return bcrypt.compareSync(password, hash);
        }
    }

    User.init({
        username: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: DataTypes.STRING,
        // other attributes...
    }, {
        sequelize,
        modelName: 'User',
    });

    return User;
};
