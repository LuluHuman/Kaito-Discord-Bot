const fs = require("fs")
const path = require("path")
class countingDB {
    async get(value) {
        const dbFile = await fs.readFileSync(path.join(__dirname, './../db.json'), "utf8")
        const countingDB = JSON.parse(dbFile)
        if (countingDB[value]) return countingDB[value]
        return countingDB
    }
    async set(key, value) {
        const dbFile = await fs.readFileSync(path.join(__dirname, './../db.json'), "utf8")
        const countingDB = JSON.parse(dbFile)

        if (!(Object.keys(countingDB).includes(key))) return `ERROR ${key} is not a type`
        countingDB[key] = value

        await fs.writeFileSync(path.join(__dirname, './../db.json'), JSON.stringify(countingDB))
        return countingDB
    }
}

class userDB {
    async get(userId, key, defaultValue) {
        const userDir = path.join(__dirname, `../userDB/${userId}`)
        if (fs.existsSync(userDir) == false) { await fs.mkdirSync(userDir) }
        const keyDir = path.join(userDir, key + ".json")
        if (fs.existsSync(keyDir) == false) {  await fs.writeFileSync(keyDir , JSON.stringify({ "value": defaultValue })) }
        var val = await fs.readFileSync(keyDir, "utf8")
        val = JSON.parse(val)
        return val.value
    }
    async set(userId, key, value) {
        const userDir = path.join(__dirname, `../userDB/${userId}`)
        if (fs.existsSync(userDir) == false) { await fs.mkdirSync(userDir) }
        const keyDir = path.join(userDir, key + ".json")
        await fs.writeFileSync(keyDir, JSON.stringify({ "value": value }))
        return countingDB
    }
}

exports.counting = new countingDB
exports.user = new userDB