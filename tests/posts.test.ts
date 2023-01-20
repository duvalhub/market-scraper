// const mockResponse = require('./response.json') 
import * as fs from 'fs';

import { PostResponse } from '../src/model';

describe('Posts', () => {
    let mockResponse: PostResponse;
    beforeEach(() => {
        jest.resetModules()
        mockResponse = JSON.parse(fs.readFileSync('./tests/response.json', 'utf8'));
    });


    it("persists all message of Response that match a rule", async () => {
        const { processPostsReponse, sequelize, RecordRepository } = await import('../src/posts');

        // Arrange
        await sequelize.sync()

        // Act
        const result = await processPostsReponse(mockResponse)

        // Assert
        const persisted = await RecordRepository.findAll()
        expect(persisted.length).toEqual(2);
    })

    it("persists messages if not already persisted", async () => {
        const { processPostsReponse, sequelize, RecordRepository } = await import('../src/posts');

        // Arrange
        await sequelize.sync()

        // Act
        const persisted2 = await RecordRepository.findAll()
        const result = await processPostsReponse(mockResponse)

        // Assert
        const persisted = await RecordRepository.findAll()
        expect(persisted.length).toEqual(2);
    })

})