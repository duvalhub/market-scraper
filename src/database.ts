import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { Record } from './model';

let sequelize: Sequelize
if (process.env.NODE_ENV == 'production') {
    const {
        MYSQL_HOST,
        MYSQL_DATABASE,
        MYSQL_USER,
        MYSQL_PASSWORD
    } = process.env
    sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
        host: MYSQL_HOST,
        dialect: 'mariadb'
    });
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
    date: { type: DataTypes.DATE, allowNull: false }
});

await sequelize.sync()
