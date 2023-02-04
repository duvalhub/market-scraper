import * as fs from 'fs';
import { PostResponse, Record } from '../src/model.js';

describe('Posts', () => {
    let mockResponse: PostResponse;
    beforeEach(() => {
        jest.resetModules()
        mockResponse = JSON.parse(fs.readFileSync('./tests/response.json', 'utf8'));
    });


    it("persists all message of Response that match a rule", async () => {
        const { processPostsReponse } = await import('../src/posts.js');
        const { sequelize, RecordRepository } = await import('../src/database.js');

        // Arrange
        try {
            await sequelize.sync({ force: true })
        } catch (e) {
            console.error(e)
        }

        // Act
        const result = await processPostsReponse(mockResponse)

        // Assert
        const persisted = await RecordRepository.findAll()
        expect(persisted.length).toEqual(2);
    })

    it("persists messages if not already persisted", async () => {
        const { processPostsReponse } = await import('../src/posts.js');
        const { sequelize, RecordRepository } = await import('../src/database.js');

        // Arrange
        const toBePersisted: Array<Record> = [
            {
                postId: 1,
                category: "is it",
                date: new Date("1970-01-01"),
                ticker: "GLO",
                message: "$GLO as",
                price: 12,
                isClosed: false
            },
            {
                postId: 2,
                category: "at it",
                date: new Date("1970-02-01"),
                ticker: "GLE",
                message: "$GLE some",

                price: 12,
                isClosed: false
            },
            {
                postId: 3,
                category: "at it",
                date: new Date("1970-02-01"),
                ticker: "GLE",
                message: "$GLE qwe",
                price: 12,
                isClosed: false
            },
            {
                postId: 3,
                category: "at it",
                date: new Date("1970-02-01"),
                ticker: "GLE",
                message: "$GLE qwe",
                price: 12,
                isClosed: false
            }
        ]
        await sequelize.sync()

        // Act
        const result = await Promise.all(toBePersisted.map(async (entity) => {
            try {
                return await RecordRepository.create(entity)
            } catch (err) {

            }

        }))

        // Assert
        const persisted = await RecordRepository.findAll()
        expect(persisted.length).toEqual(3);
    })

})