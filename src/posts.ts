import axios from 'axios';
// Maybe preset: ts-jest would help
// See: https://github.com/ContentSquare/readapt/blob/master/packages/visual-engine/jest.config.js
import { configs, rules } from './config.js';
import { RecordRepository } from './database.js';
import { Message, PostResponse, Record } from './model.js';
import { removeSpecialCharacters } from './utils.js';

const { STOCKWITS_API } = configs

export const getUnfinishedPlays = async () => {
    return await RecordRepository.findAll({
        where: {
            isClosed: false
        }
    })
}
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
            const isRecordExist = await RecordRepository.findOne({
                where: {
                    postId: msg.id
                }
            })
            if (!isRecordExist) {
                console.log(`Persisting new post '${msg.body}' at ${msg.created_at}...`)
                const price = await findMessagePrice(msg)
                const record = mapToEntity(msg, rule, price)
                return await RecordRepository.create(record)
            }
        } else {
            console.log("Found no match for: ", msg.body)
        }
    })
    const result = await Promise.all(promises)
    return result.filter(r => r)
}

export const findRule = (body: string) => rules.find(rule => removeSpecialCharacters(body).includes(rule))

export const mapToEntity = (message: Message, rule: string, price: number): Record => {
    const ticker = message.symbols?.[0]?.symbol
    return {
        postId: message.id,
        category: rule,
        ticker: ticker,
        message: message.body,
        date: new Date(message.created_at),
        price: price,
        isClosed: false
    }
}

async function findMessagePrice(message) {
    const id = message.id
    let url = new URL(`${STOCKWITS_API}/api/2/messages/${id}/conversation.json`)
    return await fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(res => {
            const prices = res.message.prices
            if (prices) {
                const price = prices[0]?.price
                if (price) {
                    return Number(price)
                }
            }
            return null
        })
}
