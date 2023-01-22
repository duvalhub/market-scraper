
import { triggerPostsFetch } from './posts';
import { launchServer } from './server';

console.log('Lauching app');

(async () => {
    await launchServer()
    try {
        const result = await triggerPostsFetch()
        console.log(`We have persisted ${result.length} events`)
    } catch (err) {
        console.log(`Error loading data` )
    }
})()
