class Logger {
  static consoleLog(logMessage: any, type: 'error' | 'warn' | 'log' = 'log') {
    if (__DEV__) {
      console[type](logMessage);
    }
  }
  /**
   * @description Log the error to the server
   * @param logMessage message to track.
   */
  static trackLog(logMessage: any) {
    if (!__DEV__) {
    }
    throw new Error('not implemented.');
    //log to server.
  }
}

export default Logger;
