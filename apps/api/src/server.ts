/**
 * @filedesc Server entry point
 * @description Starts Express server on configured port
 */

import app from './app.js';
import config from './config/config.js';

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
