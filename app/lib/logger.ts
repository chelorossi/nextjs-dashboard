import pino, { Logger, LoggerOptions } from "pino";

const loggerConfig = (): LoggerOptions => {
  const isProduction = process.env["NODE_ENV"] === "production";
  return {
    level: isProduction ? "warn" : "debug", // debug and trace logs are only valid for development. Additional levels can be added to the instance via the customLevels option.
    transport: isProduction
      ? undefined
      : {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
    msgPrefix: "[replyto.xyz]",
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label, number) {
        return { level: label };
      },
      bindings(bindings) {
        return isProduction
          ? { pid: bindings.pid, hostname: bindings.hostname }
          : {};
      },
      log(object) {
        return object;
      },
    },
    messageKey: "msg",
    errorKey: "err",
    nestedKey: "payload",
  };
};

export const logger: Logger = pino(loggerConfig());
