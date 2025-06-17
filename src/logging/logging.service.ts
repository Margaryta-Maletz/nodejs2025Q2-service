import { ConsoleLogger, Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logStream;
  private readonly logLevel: string;

  constructor() {
    super();
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.setupLogFile();
    this.setupErrorListeners();
  }

  private setupLogFile() {
    const logDir = process.env.LOG_DIR || '/app/logs';
    const maxFileSizeKB = parseInt(
      process.env.LOG_FILE_MAX_SIZE_KB || '1024',
      10,
    );
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFilePath = join(logDir, 'app.log');
    this.logStream = createWriteStream(logFilePath, { flags: 'a' });

    fs.watchFile(logFilePath, (curr) => {
      if (curr.size / 1024 > maxFileSizeKB) {
        fs.renameSync(logFilePath, `${logFilePath}.${Date.now()}`);
        this.logStream = createWriteStream(logFilePath, { flags: 'a' });
      }
    });
  }

  private setupErrorListeners() {
    process.on('uncaughtException', (error) => {
      this.error(`Uncaught Exception: ${error.message}`, error.stack);
    });

    process.on('unhandledRejection', (reason) => {
      this.error(`Unhandled Rejection: ${reason}`);
    });
  }

  log(message: string) {
    if (this.logLevel === 'info' || this.logLevel === 'debug') {
      super.log(message);
      this.logStream.write(`[LOG] ${new Date().toISOString()} - ${message}\n`);
    }
  }

  error(message: string, trace?: string) {
    if (this.logLevel !== 'silent') {
      super.error(message);
      this.logStream.write(
        `[ERROR] ${new Date().toISOString()} - ${message} - ${trace || ''}\n`,
      );
    }
  }

  warn(message: string) {
    if (this.logLevel === 'warn' || this.logLevel === 'debug') {
      super.warn(message);
      this.logStream.write(`[WARN] ${new Date().toISOString()} - ${message}\n`);
    }
  }
}
