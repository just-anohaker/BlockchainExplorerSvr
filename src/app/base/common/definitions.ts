import koa = require("koa");
import socketio = require("socket.io");

// /notification body types defined
// /NB prefix equals to Notification Body
export type NBInitServer = {
    koa: koa<any, {}>;
    io: socketio.Server;
};

export type NBOkexTicker = {
    instrument_id: string;
    last: string;
};