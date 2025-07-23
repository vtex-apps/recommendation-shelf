import { generateRecOriginHeader } from './requests'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

type LoggerOptions = {
  message: string
  data?: Record<
    string,
    number | string | boolean | undefined | null | object[] | Error
  > // Changed to Record for better type safety
  sendLog?: boolean
}

function getAccount() {
  return window.__RUNTIME__?.account
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
        console.info(message, args.data)
        break
      case 'warn':
        console.warn(message, args.data)
        break
      case 'error':
        console.error(message, args.data)
        break
      default:
        // eslint-disable-next-line no-console
        console.log(message, args.data)
    }

    // Send log to service if sendLog is true
    if (args.sendLog) {
      this.sendLogToService(level, args)
    }
  }

  private async sendLogToService(level: LogLevel, args: LoggerOptions) {
    const account = getAccount()
    if (!account) {
      console.warn('No account found, skipping log sending')
      return
    }

    try {
      await fetch(`/api/recommend-bff/logs?an=${account}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...generateRecOriginHeader(account),
        },
        body: JSON.stringify({
          app: 'vtex.recommendation-shelf',
          message: args.message,
          level,
          ...args.data,
        }),
      })
    } catch (error) {
      // Silent fail to avoid logging loops
      console.error(
        `${this.prefix} Failed to send log to service: (${args.message})`,
        error
      )
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
