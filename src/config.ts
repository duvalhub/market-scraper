import { config } from 'dotenv'
import { removeSpecialCharacters } from "./utils.js"
config()

export const configs = {
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
    ALPHA_VANTAGE_URL: process.env.ALPHA_VANTAGE_URL,
    STOCKWITS_API: process.env.STOCKWITS_API,
    LOAD_POSTS_CRON: "0 */5 * * * *",
    EVALUATE_PLAYS_CRON: "0 0 */5 * * *",
    PLAY_EXPIRED_HOURS: Number(process.env.PLAY_EXPIRED_HOURS),
    STOP_LOSS_PERCENT: 0.2,
    ENABLED_CRONS: process.env.ENABLED_CRONS === "false" ? false : true
}

// Check if any configuration is null
if (Object.keys(configs).some(k => {
    const value = configs[k]
    const invalid = !value
    if (invalid) {
        console.error("Missing configuration ", k)
    }
    return invalid
})) {
    throw new Error("Invalid configuration.")
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