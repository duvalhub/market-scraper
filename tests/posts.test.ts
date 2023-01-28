import * as fs from 'fs';
import { PostResponse, Record } from '../src/model';

describe('Posts', () => {
    let mockResponse: PostResponse;
    beforeEach(() => {
        jest.resetModules()
        mockResponse = JSON.parse(fs.readFileSync('./tests/response.json', 'utf8'));
    });


    it("persists all message of Response that match a rule", async () => {
        const { processPostsReponse } = await import('../src/posts');
        const { sequelize, RecordRepository } = await import('../src/database');

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
        const { processPostsReponse } = await import('../src/posts');
        const { sequelize, RecordRepository } = await import('../src/database');

        // Arrange
        const toBePersisted: Array<Record> = [
            {
                postId: 1,
                category: "is it",
                date: new Date("1970-01-01"),
                ticker: "GLO",
                message: "$GLO as"
            },
            {
                postId: 2,
                category: "at it",
                date: new Date("1970-02-01"),
                ticker: "GLE",
                message: "$GLE some"
            },
            {
                postId: 3,
                category: "at it",
                date: new Date("1970-02-01"),
                ticker: "GLE",
                message: "$GLE qwe"
            },
            {
                postId: 3,
                category: "at it",
                date: new Date("1970-02-01"),
                ticker: "GLE",
                message: "$GLE qwe"
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