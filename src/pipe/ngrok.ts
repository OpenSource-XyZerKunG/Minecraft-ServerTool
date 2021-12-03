import { Ngrok } from "ngrok"

export enum ngrokChannel {
    START = "ngrok:startService",
    KILL = "ngrok:killService"
}

export type startParameters = {
    "authtoken": string,
    "proto": Ngrok.Protocol,
    "addr": string | number,
    "region": Ngrok.Region
}

export type killParameters = {
    "url": string
}