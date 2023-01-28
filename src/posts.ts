import axios from 'axios';
import { configs, rules } from './config.js';
import { RecordRepository } from './database.js';
import { Message, PostResponse, Record } from './model.js';
import { removeSpecialCharacters } from './utils.js';

const { STOCKWITS_API } = configs

export const triggerPostsFetch = async () => {
    const postResponse: PostResponse = await fetchPosts()
    return await processPostsReponse(postResponse)
}

export const fetchPosts = async () => {
    console.log("Fetching post from: ", STOCKWITS_API)
    const response = await axios.get(`${STOCKWITS_API}/api/2/streams/user/alejos11.json?filter=all&limit=21`)
    return response.data
}

export const processPostsReponse = async (postResponse: PostResponse) => {
    const promises = postResponse.messages.map(async (msg) => {
        const rule = findRule(msg.body)
        if (rule) {
            console.log(`Persisting Alex post: '${msg.body}' at ${msg.created_at} (${msg.likes.total} likes)'`)
            const record = mapToEntity(msg, rule)
            return await RecordRepository.create(record)
        }
    })
    const result = await Promise.all(promises)
    return result.filter(r => r)
}

export const findRule = (body: string) => {
    return rules.find(rule => removeSpecialCharacters(body).includes(rule))
}

export const mapToEntity = (message: Message, rule: string): Record => {
    return {
        postId: message.id,
        category: rule,
        ticker: message.body,
        date: new Date(message.created_at),
    }
}