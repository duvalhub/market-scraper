// import config from './config.cjs';
import { config } from 'dotenv';
import { triggerPostsFetch } from './posts.js';
import { launchServer } from './server.js';
config()

console.log(`Lauching app`);

// console.log("", config);

(async () => {
    await launchServer()
    try {
        const result = await triggerPostsFetch()
        console.log(`We have persisted ${result.length} events`)
    } catch (err) {
        console.log(`Error loading data`)
    }
})()
