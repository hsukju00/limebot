import * as path from "path";
import { text } from "stream/consumers";
import { format, createLogger, transports } from "winston";
import "winston-daily-rotate-file";

const logDir = path.join(__dirname, "../../logs");

const logFormat = format.printf(
    ({ service, timestamp, level, message, stack }) => {
        const format = `${timestamp} [${service}] ${level}: ${message}`;
        return stack ? format + "\n" + stack : format;
    }
);

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        format.uncolorize(),
        logFormat
    ),
    defaultMeta: { service: "Limebot" },
    transports: [
        new transports.DailyRotateFile({
            level: "info",
            datePattern: "YYYY-MM-DD",
            dirname: logDir,
            filename: `%DATE%.log`,
            maxFiles: 30,
        }),
        new transports.DailyRotateFile({
            level: "error",
            datePattern: "YYYY-MM-DD",
            dirname: logDir + "/error",
            filename: `%DATE%.error.log`,
            maxFiles: 30,
        }),
    ],
    exceptionHandlers: [
        new transports.DailyRotateFile({
            level: "error",
            datePattern: "YYYY-MM-DD",
            dirname: logDir + "/exception",
            filename: `%DATE%.exception.log`,
            maxFiles: 30,
        }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new transports.Console({
            format: format.combine(format.colorize(), logFormat),
        })
    );
}

export default logger;
