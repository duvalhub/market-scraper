import axios from 'axios';
import { DataTypes, Sequelize } from 'sequelize';
import { removeSpecialCharacters, rules } from './constants';
import { Message, PostResponse } from './model';
const url = "https://api.stocktwits.com/api/2/streams/user/alejos11.json?filter=all&limit=21"
export const sequelize = new Sequelize('sqlite::memory:');

export const RecordRepository = sequelize.define('Record', {
    id: { type: DataTypes.NUMBER, primaryKey: true },
    category: DataTypes.STRING,
    ticker: DataTypes.STRING,
    date: DataTypes.DATE,
});

export const triggerPostsFetch = async () => {
    const postResponse: PostResponse = await fetchPosts()
    await processPostsReponse(postResponse)
}

export const fetchPosts = async () => {
    const response = await axios.get(url)
    return response.data
}


export const processPostsReponse = async (postResponse: PostResponse) => {
    return await Promise.all(postResponse.messages.map(async (msg) => {
        const rule = findRule(msg.body)
        if (rule) {
            console.log(`Persisting Alex post: '${msg.body}' at ${msg.created_at} (${msg.likes.total} likes)'`)
            const record = mapToEntity(msg, rule)
            return await RecordRepository.create(record)
        }
    }))
}

export const findRule = (body: string) => {
    return rules.find(rule => removeSpecialCharacters(body).includes(rule))
}

export const mapToEntity = (message: Message, rule: string) => {
    return {
        id: message.id,
        category: rule,
        ticker: message.body,
        date: message.created_at,
    }
}