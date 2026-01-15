/**
 * @filedesc Server entry point
 * @description Starts Express server on configured port
 */

import app from './app.ts';
import config from './config/config.ts';

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
