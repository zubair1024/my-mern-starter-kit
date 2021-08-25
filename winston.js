import path from 'path';

import winston from 'winston';

const { transports, createLogger, format } = winston;

const PROJECT_ROOT = path.join(path.resolve(), '.');

// Winston Levels:
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }

const simpleLogger = createLogger({
  format: format.errors({ stack: true }),
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.splat(),
        format.colorize(),
        format.printf((info) => formatTextLogs(info))
      ),
      level: 'info',
      handleExceptions: true,
    }),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

/**
 * Attempts to add file and line number info to the given log arguments.
 */
const formatLogArguments = (args) => {
  args = Array.prototype.slice.call(args);

  const stackInfo = getStackInfo(1);

  if (stackInfo) {
    // get file path relative to project root
    const calleeStr = '(' + stackInfo.relativePath + ':' + stackInfo.line + ')';

    if (typeof args[0] === 'string') {
      args[0] = calleeStr + ' ' + args[0];
    } else {
      args.unshift(calleeStr);
    }
  }

  return args;
};
/**
 * Parses and returns info about the call stack at the given index.
 */
const getStackInfo = (stackIndex) => {
  // get call stack, and analyze it
  // get all file, method, and line numbers
  const stacklist = new Error().stack.split('\n').slice(3);

  // stack trace format:
  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
  // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
  const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
  const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

  const s = stacklist[stackIndex] || stacklist[0];
  const sp = stackReg.exec(s) || stackReg2.exec(s);

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(PROJECT_ROOT, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join('\n'),
    };
  }
};

/**
 * Custom formatter for text based transport logs
 * @param {*} info
 */
const formatTextLogs = (info) => {
  // Remove duplicate error message
  // https://github.com/winstonjs/winston/issues/1660
  const duplicateErrorMessage = info.stack ? info[Symbol.for('splat')]?.[0]?.message : '';
  if (duplicateErrorMessage) {
    info.message = info.message.slice(0, -duplicateErrorMessage.length - 1);
    return `[${info.timestamp}] [${info.level}]: ${info.message}; ${info.stack}`;
  }
  return `[${info.timestamp}] [${info.level}]: ${info.stack || info.message}`;
};

// A custom logger interface that wraps winston, making it easy to instrument
// code and still possible to replace winston in the future.
const extendedLogger = {
  debug() {
    simpleLogger.debug.apply(simpleLogger, formatLogArguments(arguments));
  },
  log() {
    simpleLogger.debug.apply(simpleLogger, formatLogArguments(arguments));
  },
  verbose() {
    simpleLogger.verbose.apply(simpleLogger, formatLogArguments(arguments));
  },
  info() {
    simpleLogger.info.apply(simpleLogger, formatLogArguments(arguments));
  },
  warn() {
    simpleLogger.warn.apply(simpleLogger, formatLogArguments(arguments));
  },
  error() {
    simpleLogger.error.apply(simpleLogger, formatLogArguments(arguments));
  },
  child() {
    return new Proxy(extendedLogger, {});
  },
};

export const logger = extendedLogger;
