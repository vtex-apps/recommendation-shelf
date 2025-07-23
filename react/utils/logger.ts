type LogLevel = 'info' | 'warn' | 'error' | 'debug'

type LoggerOptions = {
  message: string
  data?: unknown
  sendLog?: boolean
}

class Logger {
  private prefix: string

  constructor() {
    this.prefix = '[vtex.recommendation-shelf@2.x]'
  }

  public log(level: LogLevel, args: LoggerOptions) {
    const message = `${this.prefix} ${args.message}`
    /* eslint-disable padding-line-between-statements */
    switch (level) {
      case 'info':
        console.info(...message)
        break
      case 'warn':
        console.warn(...message)
        break
      case 'error':
        console.error(...message)
        break
      default:
        // eslint-disable-next-line no-console
        console.log(...message)
    }
  }

  public info(args: LoggerOptions) {
    this.log('info', args)
  }

  public warn(args: LoggerOptions) {
    this.log('warn', args)
  }

  public error(args: LoggerOptions) {
    this.log('error', args)
  }

  public debug(args: LoggerOptions) {
    this.log('debug', args)
  }
}

export const logger = new Logger()
