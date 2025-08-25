import { constants } from './lib/constants.js';
import app from './lib/app.js';
import similar from './lib/similar.js';
import permissions from './lib/permissions.js';
import datasafety from './lib/datasafety.js';

// Chỉ giữ các method cần thiết
const methods = {
  app,
  similar,
  permissions,
  datasafety
};

// Xuất ra constants + methods
export default Object.assign({}, constants, methods);
