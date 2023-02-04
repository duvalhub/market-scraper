import fs from 'fs';
import { DataTypes, InferAttributes, InferCreationAttributes, Model, Options, Sequelize } from "sequelize";
import { Record } from './model.js';

let sequelize: Sequelize
if (process.env.NODE_ENV == 'production') {
    const {
        MYSQL_HOST,
        MYSQL_DATABASE,
        MYSQL_USER,
        MYSQL_PASSWORD,
        MYSQL_SSL
    } = process.env
    let options: Options = {
        ssl: true,
        port: 3306,
        database: MYSQL_DATABASE,
        host: MYSQL_HOST,
        username: MYSQL_USER,
        password: MYSQL_PASSWORD,
        dialect: 'mariadb',
    }
    if (MYSQL_SSL) {
        const serverCert = [fs.readFileSync("./tmp/ca.crt", "utf8")];
        options = {
            ...options,
            dialectOptions: {
                ssl: {
                    ca: serverCert
                }
            }
        }
    }
    sequelize = new Sequelize(options);
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
} else {
    sequelize = new Sequelize('sqlite::memory:');
}

export { sequelize };

export interface RecordModel extends Record, Model<InferAttributes<RecordModel>, InferCreationAttributes<RecordModel>> { }

export const RecordRepository = sequelize.define<RecordModel>('Record', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    postId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    category: { type: DataTypes.STRING, allowNull: true },
    message: { type: DataTypes.STRING, allowNull: false },
    ticker: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DOUBLE, allowNull: true },
    date: { type: DataTypes.DATE, allowNull: false },
    isClosed: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    quality: { type: DataTypes.INTEGER, allowNull: true },
    bestPrice: { type: DataTypes.DOUBLE, allowNull: true },
    bestPricePercent: { type: DataTypes.DOUBLE, allowNull: true },
    bestDate: { type: DataTypes.DATE, allowNull: true }
});

await sequelize.sync()
