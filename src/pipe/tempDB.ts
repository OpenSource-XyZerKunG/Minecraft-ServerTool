export type GET = {
    "path": string,
    "returnChannel": string
}

export type GETCOLLECTION = {
    "path": COLLECTION,
    "returnChannel": string
}

export type STORE = {
    "path": string,
    "data": any
}

export enum GLOBAL {
    CONSOLETITLE = "servertool.collection.consoletitle",
    FOLDERNAME = "servertool.collection.foldername",
    ENVVAR = "servertool.collection.envvar",
    SERVERVERSION = "servertool.collection.serverversion",
    SERVERURL = "servertool.collection.serverurl",
    SERVERTYPE = "servertool.collection.servertype",
    EULA = "servertool.collection.eula",
    NOGUI = "servertool.collection.nogui",
    AUTORUN = "servertool.collection.autorun",
    LOCATION = "servertool.collection.location",

    NGROKTOKEN = "servertool.ngrok.token",
    NGROKREGION = "servertool.ngrok.region",
}

export enum COLLECTION {
    PACKAGECOLLECTION = "servertool.collection",
    NGROKCOLLECTION = "servertool.ngrok",
}

export type CallbackCollection = {
    "url": string,
    "data": string
}