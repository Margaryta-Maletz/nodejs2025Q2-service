import { ConsoleLogger, Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logStream;

  constructor() {
    super();
    this.setupLogFile();
  }

  private setupLogFile() {
    const logDir = process.env.LOG_DIR || '/app/logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFilePath = join(logDir, 'app.log');
    this.logStream = createWriteStream(logFilePath, { flags: 'a' });
  }

  log(message: string) {
    super.log(message);
    this.logStream.write(`[LOG] ${new Date().toISOString()} - ${message}\n`);
  }

  error(message: string, trace?: string) {
    super.log(message);
    this.logStream.write(
      `[ERROR] ${new Date().toISOString()} - ${message} - ${trace}\n`,
    );
  }

  warn(message: string) {
    super.log(message);
    this.logStream.write(`[WARN] ${new Date().toISOString()} - ${message}\n`);
  }
}
