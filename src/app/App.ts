import program = require("commander");
import koa = require("koa");
import koaBodyParser = require("koa-bodyparser");
import koaCors = require("@koa/cors");
import socketio = require("socket.io");
import { Server } from "http";

import AppFacade from "./facade/AppFacade";

function main(): void {
    program
        .version("1.0.0")
        .option("--host <hostname>", "configurate server host", "0.0.0.0")
        .option("--port <port>", "configurate server post", 2019)
        .parse(process.argv);


    initServer();

    process.on("uncaughtException", error => { });
    process.on("unhandledRejection", reason => { });
    process.on("rejectionHandled", promise => { });
}

main();

function initServer() {
    const app = new koa();
    const httpsvr = new Server(app.callback());
    const httpio = socketio(httpsvr);

    app.on("error", (err, ctx) => {
        if (ctx != null) {
            console.log(`[app] ${ctx.method}:${ctx.path} error: ${err.toString()}`);
        } else {
            console.log(`[app] error: ${err.toString()}`)
        }
    });

    app.use(koaBodyParser());
    app.use(async (ctx, next) => {
        console.log(`[app] ${ctx.method}:${ctx.path}`);
        await next();
    });
    app.use(async (ctx, next) => {
        ctx.body = ctx.request.body;
        await next();
    });
    app.use(koaCors());

    // init application;
    AppFacade.getInstance().initServer(app, httpio);

    app.use(async ctx => {
        ctx.body = {
            success: false,
            error: "api endpoint not found"
        };
    });

    httpsvr.listen(program.port, program.host, () => {
        console.log(`[app] listening on http://${program.host}:${program.port}`);
    });

    AppFacade.getInstance().appReady();
    return { app, http: httpsvr, io: httpio };
}