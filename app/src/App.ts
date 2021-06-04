import { logger, LoggerOptions } from "express-winston";
import { error, format, transports } from "winston";
import { env } from "process";
import { CommonRoutesConfig } from "./Common/Common.Routes.Config";
import { UsersRoutes } from "./Users/Users.Routes.Config";
import express, { Application } from "express";
import debug, { IDebugger } from "debug";
import cors from "cors";
import { readFileSync } from "fs";

const app: Application = express();
const port = env.PORT || 3000;
const running = `<i>Italic text</i>`;
const routes: CommonRoutesConfig[] = [];
const debugLog: IDebugger = debug("App");

app.use(express.json());
app.use(cors());

const loggerOptions: LoggerOptions = {
    transports: [new transports.Console()],
    format: format.combine(
        format.json(),
        format.prettyPrint(),
        format.colorize({ all: true })
    )
}

if (!process.env.DEBUG)
    loggerOptions.meta = false;

app.use(logger(loggerOptions));
routes.push(new UsersRoutes(app));

const homepageHTML = readFileSync(__dirname + "/../html/index.html", { encoding: "utf8" });

app
    .get("/", (req, res) => res.status(200).send(homepageHTML))
    .listen(port, () => {
        routes.forEach(route => debugLog(`Routes configured for ${route.Name}`));
        console.log(running);
    });