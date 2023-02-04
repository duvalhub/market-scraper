// import config from './config.cjs';
import { config } from 'dotenv';
import schedule from 'node-schedule';
import { configs } from './config.js';
import { evaluateAllPlays } from './market-data.js';
import { triggerPostsFetch } from './posts.js';
import { launchServer } from './server.js';
config()

console.log(`Lauching app`);

await launchServer()
console.log("Trigger cron with: ", configs.LOAD_POSTS_CRON)
schedule.scheduleJob(configs.LOAD_POSTS_CRON, () => {
    console.log("Pooling new posts...");
    (async () => {
        try {
            const result = await triggerPostsFetch()
            console.log(`We have persisted ${result.length} events`)
        } catch (err) {
            console.error(`Error loading data`, err)
        }
    })()
});

schedule.scheduleJob(configs.EVALUATE_PLAYS_CRON, () => {
    console.log("Processing the plays to define their quality...");
    (async () => {
        try {
            await evaluateAllPlays()
        } catch (err) {
            console.error(`Error evaluation plays`, err)
        }
    })()
});
