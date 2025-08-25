import * as R from 'ramda';
import request from './utils/request.js';
import scriptData from './utils/scriptData.js';
import { BASE_URL, constants } from './constants.js';

async function permissions(opts) {
  if (!opts || !opts.appId) {
    throw Error('appId missing');
  }

  opts.lang = opts.lang || 'en';
  return processPermissions(opts);
}

async function processPermissions(opts) {
  const body = `f.req=%5B%5B%5B%22xdSrCf%22%2C%22%5B%5Bnull%2C%5B%5C%22${opts.appId}%5C%22%2C7%5D%2C%5B%5D%5D%5D%22%2Cnull%2C%221%22%5D%5D%5D`;
  const url = `${BASE_URL}/_/PlayStoreUi/data/batchexecute?rpcids=qnKhOb&f.sid=-697906427155521722&bl=boq_playuiserver_20190903.08_p0&hl=${opts.lang}&authuser&soc-app=121&soc-platform=1&soc-device=1&_reqid=1065213`;

  const requestOptions = Object.assign({
    url,
    method: 'POST',
    body,
    followRedirect: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  }, opts.requestOptions);

  // gọi qua request đã patch
  const html = await request(requestOptions, opts.throttle);

  const input = JSON.parse(html.substring(5));
  const data = JSON.parse(input[0][2]);

  if (data === null) {
    return [];
  }

  return (opts.short)
    ? processShortPermissionsData(data)
    : processPermissionData(data);
}

const MAPPINGS = {
  permissions: [2],
  type: 0
};

function processShortPermissionsData(html) {
  if (R.is(String, html)) {
    html = scriptData.parse(html);
  }

  const commonPermissions = html[constants.permission.COMMON];
  if (!commonPermissions) {
    return [];
  }

  const validPermissions = commonPermissions.filter(permission => permission.length);
  return R.chain(permission => permission[MAPPINGS.type], validPermissions);
}

function processPermissionData(html) {
  if (R.is(String, html)) {
    html = scriptData.parse(html);
  }

  const permissions = Object.values(constants.permission).reduce((acc, permission) => {
    if (!html[permission]) {
      return acc;
    }
    acc.push(...R.chain(flatMapPermissions, html[permission]));
    return acc;
  }, []);

  return permissions;
}

function flatMapPermissions(permission) {
  const input = R.path(MAPPINGS.permissions, permission);
  if (typeof input === 'undefined') {
    return [];
  }
  const mappings = getPermissionMappings(permission[MAPPINGS.type]);
  return R.map(scriptData.extractor(mappings), input);
}

function getPermissionMappings(type) {
  return {
    permission: [1],
    type: {
      path: 0,
      fun: () => type
    }
  };
}

export default permissions;
