function getLocalStorage(key: string) {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : null;
}
function setLocalStorage(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}
function removeLocalStorage(key: string) {
  localStorage.removeItem(key);
}
function clearLocalStorage() {
  localStorage.clear();
}
function getSessionStorage(key: string) {
  return sessionStorage.getItem(key) ? JSON.parse(sessionStorage.getItem(key)!) : null;
}
function setSessionStorage(key: string, data: unknown) {
  sessionStorage.setItem(key, JSON.stringify(data));
}
function removeSessionStorage(key: string) {
  sessionStorage.removeItem(key);
}
function clearSessionStorage() {
  sessionStorage.clear();
}
export {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
  getSessionStorage,
  setSessionStorage,
  removeSessionStorage,
  clearSessionStorage
};
