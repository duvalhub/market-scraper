import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { Record } from './model';

export const sequelize = new Sequelize('sqlite::memory:');

export interface RecordModel extends Record, Model<InferAttributes<RecordModel>, InferCreationAttributes<RecordModel>> { }

export const RecordRepository = sequelize.define<RecordModel>('Record', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    postId: { type: DataTypes.NUMBER, allowNull: false, unique: true },
    category: { type: DataTypes.STRING, allowNull: false },
    ticker: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false }
});

await sequelize.sync()
