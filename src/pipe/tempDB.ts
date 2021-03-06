export type GET = { "path": GLOBAL }

export type GETCOLLECTION = { "path": COLLECTION }

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
    JAVAPATH = "servertool.collection.javapath",

    NGROKTOKEN = "servertool.ngrok.token",
    NGROKREGION = "servertool.ngrok.region",

    TERMINALCONFIG = "servertool.terminal.config",
}

export enum COLLECTION {
    PACKAGECOLLECTION = "servertool.collection",
    NGROKCOLLECTION = "servertool.ngrok",
}

export type CallbackCollection = {
    "url": string,
    "data": string
}