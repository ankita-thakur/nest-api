import * as winston from 'winston';
const logFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  }),
);

export const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// if (process.env.NODE_ENV !== "production") {
logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  }),
);
// }
