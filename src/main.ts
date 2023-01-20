
import { fetchPosts } from './posts';
import { launchServer } from './server';

console.log('sup');

(async () => {
    await launchServer()
    const posts = await fetchPosts()
    console.log(posts)
})()


console.log('wut')