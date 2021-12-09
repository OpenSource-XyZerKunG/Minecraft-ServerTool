if (process.argv.length != 3) throw new Error("Syntax: node build.js <outputdir>")

const fs = require("fs")
const path = require("path")

async function deletes(pathurl) {
    try {
        if (fs.statSync(pathurl).isDirectory()) {
            const files = await fs.readdirSync(pathurl)
            files.forEach(async (value, index) => {
                deletes(path.join(pathurl, value))
            })
            await fs.rmdirSync(pathurl)
        } else {
            await fs.unlinkSync(pathurl)
        }
    } catch (ignore) {}
}

fs.readdir(path.join(__dirname, process.argv[2]), {}, (ignore, files) => {
    files.forEach(async (value) => {
        await deletes(path.join(__dirname, process.argv[2], value, "resources", "app", ".gitignore"))
        await deletes(path.join(__dirname, process.argv[2], value, "resources", "app", "src"))
        await deletes(path.join(__dirname, process.argv[2], value, "resources", "app", "build.js"))
        await deletes(path.join(__dirname, process.argv[2], value, "resources", "app", "tsconfig.json"))
        console.log(`Done ${value}!`)
    })
})