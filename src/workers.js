import gplay from './gplay-worker-patch/index.js';

export default {
  async fetch() {
    const data = await gplay.app({ appId: 'com.google.android.apps.translate' });
    return new Response(JSON.stringify(data, null, 2), {
      headers: { 'content-type': 'application/json;charset=UTF-8' }
    });
  }
};
