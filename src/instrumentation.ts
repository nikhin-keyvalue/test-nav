/* eslint-disable no-console */

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      console.log('Registering instrumentation...');
      await import('./instrumentation.node');
      console.log('Finished registering instrumentation!');
    }
  }