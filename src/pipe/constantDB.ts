export enum CONSTDB {
    CHANNEL = "db:const",
    DESKTOPPATH = "servertool.desktopPath",
    TERMINALLIST = "servertool.terminallist",
    NGROKLIST = "servertool.ngroklist"
}

export enum GLOBALRETURN {
    DESKTOPPATH = "servertool.desktopPath",
    TERMINALLIST = "servertool.terminallist",
    NGROKLIST = "servertool.ngroklist"
}

export type GETCONST = {
    "path": CONSTDB,
    "returnChannel": string
}