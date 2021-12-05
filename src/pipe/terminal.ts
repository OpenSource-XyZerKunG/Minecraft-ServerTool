export type TerminalConfig = {
    "title": string,
    "execute": string,
    "javaPath": string,
    "watchdog": boolean,

    "cd" ?: string,

    // "ngrok": {
    //     "enabled": boolean,
    //     "port": number[],
    // }
}

// export enum terminalChannel {
//     NEWINSTANCE = "terminal:newInstance"
// }

// export type newInstanceParameter = {
//     "name": string,
//     "execute": string,
//     "returnChannel": string
// }
// Coming soon!