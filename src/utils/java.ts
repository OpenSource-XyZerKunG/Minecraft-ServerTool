import axios from "axios";
import regedit from "regedit";
import os from "os";
import { execSync } from "child_process";

export type JavaResponse = {
    apiversion: string;
    generated:  Date;
    data:       Data;
}

export type Data = {
    count: number;
    releases: Release[];
}

export type Release = {
    version:           string;
    jbsversion:        string;
    ga:                Date;
    previous?:         string;
    family:            number;
    previousfamily?:   number;
    status:            Status;
    type:              Type;
    order:             number;
    next?:             string;
    nextfamily?:       number;
    nextfamilyupdate?: string;
    openjdk?:          string;
    jcp?:              number;
    gabuild?:          number;
    releasenotes?:     string;
    riskmatrix?:       string;
    documentation?:    string;
    eosl?:             Date;
    certconfig?:       string;
    codename?:         string;
}

export enum Status {
    Delivered = "delivered",
    Development = "development",
    Pending = "pending",
    Planning = "planning",
}

export enum Type {
    CPU = "CPU",
    EarlyAccess = "Early Access",
    Er = "ER",
    Feature = "Feature",
    Major = "Major",
    Micro = "Micro",
    Minor = "Minor",
    PSU = "PSU",
    Sa = "SA",
    Update = "Update",
}

export default class Java {
  
    private javaVersions: string[] = []
    private listJDKs: string[] = []
    private mapJDKs: Map<string, string> = new Map()
    private mapTypes: Map<string, string> = new Map()

    constructor() {
        this.getJavaVersions()
    }

    private async getJavaVersions() {
        const javaReq = await axios.get("https://www.java.com/releases/releases.json")
        const javaList: JavaResponse = await javaReq.data

        javaList.data.releases.forEach((data: Release) => {
            if (data.version.match(/\du\d+/gm)) {
                const version = data.version.split("u")
                this.javaVersions.push(data.version)
                this.javaVersions.push(`1.${version[0]}.0_${version[1]}`)
                this.javaVersions.push(`1.${version[0]}.0_${version[1].replace(/0+/gm, "")}`)
                this.javaVersions.push(`1.${version[0].replace(/.0/gm, "")}.0_${version[1]}`)
                this.javaVersions.push(`1.${version[0].replace(/.0/gm, "")}.0_${version[1].replace(/0+/gm, "")}`)
            } else {
                this.javaVersions.push(data.version)
            }
        })
    }

    private async win32() {
        await new Promise((resolve, reject) => {
            const javaReg = [ 'HKLM\\SOFTWARE\\JavaSoft\\JDK', 'HKLM\\SOFTWARE\\JavaSoft\\Java Runtime Environment' ]

            regedit.list(javaReg, async (err, result) => {
                if (err) reject(err)

                for (const path of javaReg) {
                    for (const version of result[path].keys) {
                        if (!this.listJDKs.includes(version) && this.javaVersions.includes(version)) {
                            this.listJDKs.push(version)
                            this.mapTypes.set(version, path.endsWith("JDK") ? "JDK" : "JRE")
    
                            await new Promise((resolve, reject) => {
                                regedit.list(`${path}\\${version}`, (err, result) => {
                                    if (err) reject(err)
                    
                                    this.mapJDKs.set(version, result[`${path}\\${version}`].values.JavaHome.value)          

                                    resolve(undefined)
                                })
                            })
                        }
                    }
                }

                resolve(undefined)
            })
        })
    }

    private async linux() {
        const javaList = await execSync("update-alternatives --list java")

        await new Promise((resolve, reject) => {
            try {
                for (const line of javaList.toString().split("\n")) {
                    const findMatch = line.match(/java-\d+-\w+/gm)
        
                    if (findMatch && findMatch.length === 1) {
                        const javaLine = findMatch[0].split("-")
                        
                        this.listJDKs.push(javaLine[1])
                        this.mapTypes.set(javaLine[1], javaLine[2].toUpperCase())
                        this.mapJDKs.set(javaLine[1], line)
                    }
                }
            } catch (err) {
                reject(err)
            } finally {
                console.log(this.listJDKs, this.mapTypes, this.mapJDKs)
                resolve(undefined)
            }
        })
    }

    private async darwin() {
            
    }

    async refresh() {
        switch (os.platform()) {
            case "win32":
                await this.win32()
                break
            case "darwin":
                await this.darwin()
                break
            case "linux":
                await this.linux()
                break
        }
    }

    async hasJava(): Promise<boolean> {
        return this.javaVersions.length > 0
    }

    async getList(): Promise<string[]> {
        return this.listJDKs
    }

    async getPathMap(): Promise<Map<string, string>> {
        return this.mapJDKs
    }

    async getTypeMap(): Promise<Map<string, string>> {
        return this.mapTypes
    }
}
