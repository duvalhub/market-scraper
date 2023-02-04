import { config } from 'dotenv'
import { removeSpecialCharacters } from "./utils.js"

config()

export const configs = {
    STOCKWITS_API: "https://api.stocktwits.com",
    LOAD_POSTS_CRON: "0 */5 * * * *",
    EVALUATE_PLAYS_CRON: "0 0 */5 * * *",
    PLAY_EXPIRED: 24
}
if (process.env.NODE_ENV != "production") {
    configs.STOCKWITS_API = "http://localhost:3000/stockwits"
    configs.LOAD_POSTS_CRON = "*/5 * * * * *"
}

export const rules = (() => {
    return [
        "Long-Term",
        "(New) Uptrend Confirmed",
        "5 Weeks ",
        "6 Weeks",
        "Oversold ",
        "Seller Exhaustion",
        "Due for Bounce",
        "Trend Reversal",
        "Boucing of Bottom (single/double or triple)",
        "Dead Cat Bounce",
        'Post Share Consolidation  -> Advantages : Lots of people CANNOT sell during the transition to a post share split -> usually ranges from 1 to 10 business days to be "unlocked / sellable" again.',
        "Potential Continuation",
        "Company Restructuring",
        "Gapping or Ripping or Breaking Out",
        "Round 2..3..4",
        "Back in Play",
        "An Oldie but a Goodie",
        "She's out of the Barn (again)",
        "Volume Coming In",
        "Making a Move",
        "Chart looks Good",
        "On the Run",
        "Derivative (Aka Sympathy Play)",
        "She's Getting ready",
        "She's Getting ready to make a Move",
        "Short Covering",
        "Potential Multi-Day Runner",
        "Breaking out on the Monthly Chart",
        "Setting Up for an Interesting Week",
        "Red to Green",
    ].map(s => removeSpecialCharacters(s))
})()