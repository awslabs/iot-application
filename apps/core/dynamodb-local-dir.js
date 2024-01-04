/*
 * This script prints the installation directory of dynamodb-local to `stdout`.
 * It allows us to use the output in command substitution. For example, the
 * command `ls $(node dynamodb-local-dir.js)` lists contents under the
 * installation directory of dynamodb-local.
 */

'use strict';

const os = require('os');
const path = require('path');

// reference to https://github.com/rynop/dynamodb-local/blob/1cca305c077bd600ad972569e42647d17782e921/index.js#L17
console.log(path.join(os.tmpdir(), 'dynamodb-local'));
