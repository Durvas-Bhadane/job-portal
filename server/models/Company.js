const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Company = sequelize.define(
  'Company',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // S3 URL for the company logo/image
    image: {
      type: DataTypes.STRING(500),
    },
    website: {
      type: DataTypes.STRING(300),
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'companies',
    timestamps: true,
    hooks: {
      beforeCreate: async (company) => {
        if (company.password) {
          const salt = await bcrypt.genSalt(10);
          company.password = await bcrypt.hash(company.password, salt);
        }
      },
      beforeUpdate: async (company) => {
        if (company.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          company.password = await bcrypt.hash(company.password, salt);
        }
      },
    },
  }
);

// Instance method: compare password
Company.prototype.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Instance method: hide password from JSON output
Company.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = Company;