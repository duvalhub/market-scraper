
const { Scraper, Root, DownloadContent, OpenLinks, CollectContent } = require('nodejs-web-scraper');


const config = {
    baseSiteUrl: `https://stocktwits.com/Alejos11`,
    startUrl: `https://stocktwits.com/Alejos11`,
    filePath: './images/',
    concurrency: 1,//Maximum concurrent jobs. More than 10 is not recommended.Default is 3.
    maxRetries: 3,//The scraper will try to repeat a failed request few times(excluding 404). Default is 5.       
    logPath: './logs/'//Highly recommended: Creates a friendly JSON for each operation object, with all the relevant data. 
}



const scraper = new Scraper(config);//Create a new Scraper instance, and pass config to it.

const root = new Root();//The root object fetches the startUrl, and starts the process.  


const articles = new CollectContent('h1', { name: 'article' });//"Collects" the text from each H1 element.


//Any valid cheerio selector can be passed. For further reference: https://cheerio.js.org/
const category = new OpenLinks('.category', { name: 'category' });//Opens each category page.

root.addOperation(articles);//Then we create a scraping "tree":


export const fetchPosts = async () => {
    await scraper.scrape(root)
    return articles.getData()
}