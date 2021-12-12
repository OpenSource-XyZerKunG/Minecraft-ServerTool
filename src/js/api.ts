import axios from "axios"
import fs from "fs"
import request from "request"

type mojangManifest = {
    "latest": {
        "release": string,
        "snapshot": string
    },
    "versions": { 
        "id": string, 
        "type": string, 
        "url": string 
    }[]
}

type mojangJava = { 
    "javaVersion": { 
        "component": string,
        "majorVersion": number 
    } 
} 

type paperManifest = {
    "versions": string[]
}

type paperBuild = {
    "builds": number[]
}

type jenkisJob = {
    "jobs": {
        "_class": string,
        "name": string,
        "url": string,
        "color": string
    }[]
}

async function fetchMojangManifest(type: string) {
    const manifest = await axios.get("https://launchermeta.mojang.com/mc/game/version_manifest.json")
    const jsonManifest: mojangManifest = await manifest.data
    return jsonManifest.versions.filter(version => version.type === type.toString())
}

async function fetchMojangGame(url: string) {
    const gameManifest = await axios.get(url)
    const jsonGame = await gameManifest.data
    return jsonGame.downloads.server.url
}

async function fetchSpigotManifest() {
    const manifest = await axios.get("https://hub.spigotmc.org/nexus/service/local/repositories/snapshots/content/org/spigotmc/spigot-api/maven-metadata.xml")
    const xmlManifest = await manifest.data
    const parserXML = new DOMParser().parseFromString(xmlManifest, "text/xml")
    const versions = parserXML.getElementsByTagName("metadata")[0]
        .getElementsByTagName("versioning")[0]
        .getElementsByTagName("versions")[0]
        .getElementsByTagName("version")
    let ignoreList: string[] = []
    let returnValue: string[] = []

    for (let version = versions.length - 1; version > -1; version--) {
        let nodes = versions[version].childNodes[0].nodeValue
        
        if (nodes) {
            let vars = nodes.split("-")[0]
            if (!ignoreList.includes(nodes)) {
                ignoreList.push(nodes)
                returnValue.push(vars)
            }
        }
    }

    return returnValue
}

async function fetchPaperManifest() {
    const manifest = await axios.get("https://papermc.io/api/v2/projects/paper")
    const jsonManifest: paperManifest = await manifest.data
    return jsonManifest.versions.reverse()
}

async function fetchPurpurManifest() {
    const manifest = await axios.get("https://api.pl3x.net/v2/purpur")
    const jsonManifest: paperManifest = await manifest.data
    return jsonManifest.versions
}

async function fetchAirplane() {
    const manifest = await axios.get("https://ci.tivy.ca/api/json")
    const jsonManifest: jenkisJob = await manifest.data
    return jsonManifest.jobs
}

async function findPaperURL(version: string) {
    const buildmanifest = await axios.get(`https://papermc.io/api/v2/projects/paper/versions/${version}`)
    const buildJson: paperBuild = await buildmanifest.data
    const findLatest = Math.max(...buildJson.builds)

    return `https://papermc.io/api/v2/projects/paper/versions/${version}/builds/${findLatest}/downloads/paper-${version}-${findLatest}.jar`
}

async function fetchFile(path, url, callback: Function) {
    return new Promise((resolve, reject) => {
        const filestream = fs.createWriteStream(path)
        let totalBytes = 0
        let receivedBytes = 0

        try {
            request({
                "method": "GET",
                "url": url,
                "strictSSL": false,
            }).on("response", (res) => {
                if (res.statusCode != 200) {
                    filestream.close()
                    return reject("Error to Download File ID: 0x04")
                }
                totalBytes = Number(res.headers["content-length"])
            }).on("data", (chunk) => {
                receivedBytes += chunk.length
                callback(Math.floor((receivedBytes / totalBytes) * 100))
            }).pipe(filestream).on("error", (err) => {
                filestream.close()
                reject("Error to Download File ID: 0x03")
            })

            filestream.on("finish", () => {
                filestream.close()
                resolve(100)
            })

            filestream.on("error", (err) => {
                filestream.close()
                reject("Error to Download File ID: 0x02")
            })
        } catch (err) {
            filestream.close()
            reject("Error to Download File ID: 0x01")
        }
    })
}

async function detectJavaWithVersion(id: string) {
    const manifest = await axios.get("https://launchermeta.mojang.com/mc/game/version_manifest.json")
    const jsonManifest: mojangManifest = await manifest.data

    const match = id.match(/\d+\.\d+/)

    const findVersion = jsonManifest.versions.find(version => version.id.startsWith(match ? match[0] : id.toString()))

    if (!findVersion) return null

    return await detectJavaWithURL(findVersion.url)
}

async function detectJavaWithURL(url: string | null) {
    if (!url) return 8

    const gamemanifest  = await axios.get(url)
    const gsonManifest: mojangJava = await gamemanifest.data

    return gsonManifest.javaVersion ? gsonManifest.javaVersion.majorVersion : 8
}

export default {
    fetchMojangGame,
    fetchMojangManifest,
    fetchSpigotManifest,
    fetchPaperManifest,
    fetchPurpurManifest,
    fetchAirplane,
    fetchFile,

    findPaperURL,
    
    detectJavaWithVersion,
    detectJavaWithURL,
}