//local
// export const environment = {
//   baseUrl: 'http://10.95.4.121:9091/aceCam/',
// };
// export const environment = {
//   baseUrl: 'https://dev.acecamgolf.com/api/',
// };
// export const environment = {
//   baseUrl: 'http://10.0.2.2:8080/aceCam/',
// };
export const environment = {
  baseUrl: 'http://13.203.150.178:8080/jain-app/api/',
  /** Set after you host legal-hosting/*.html — used for Play Console and optional “open in browser” in the app */
  Privacy_policy: '',
  Terms_of_service: '',
  // WebSocket base: same host as API but path /ws (no /api)
  get wsBaseUrl() {
    const u = this.baseUrl.replace(/\/api\/?$/, '');
    return u.replace(/^http/, 'ws');
  },
  // Use localhost when app runs on same machine (e.g. iOS Simulator / web)
  // baseUrl: 'http://localhost:8080/',
  // Use 10.0.2.2 when testing on Android Emulator (points to host machine)
  // baseUrl: 'http://10.0.2.2:8080/api/',
};