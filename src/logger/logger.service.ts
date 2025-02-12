import { ConsoleLogger, Injectable } from '@nestjs/common';
import chalk from 'chalk';

@Injectable()
export class LoggerService extends ConsoleLogger {
  error(message: string, trace?: string, context?: string) {
    super.error(
      chalk.red(`[Error] ${message}`),
      trace,
      this.getTimestamp(),
      context,
    );
  }

  warn(message: string, context?: string) {
    super.warn(
      chalk.yellow(`[Warning] ${message}`),
      this.getTimestamp(),
      context,
    );
  }

  log(message: string, context?: string) {
    super.log(
      chalk.blue(`[Info] ${message}`),
      this.getTimestamp(),
      context,
    );
  }

  debug(message: string, context?: string) {
    super.debug(
      chalk.green(`[Debug] ${message}`),
      this.getTimestamp(),
      context,
    );
  }

  verbose(message: string, context?: string) {
    super.verbose(
      chalk.gray(`[Verbose] ${message}`),
      this.getTimestamp(),
      context,
    );
  }

  protected getTimestamp(): string {
    const now = new Date();
    return chalk.cyan(`[${now.toISOString()}]`);
  }
} 