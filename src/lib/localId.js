export function getLocalUid() {
  try {
    const key = 'localUid';
    let uid = localStorage.getItem(key);
    if (!uid) {
      uid = 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(key, uid);
    }
    return uid;
  } catch {
    // In non-browser contexts (tests), fallback static uid
    return 'test-user';
  }
}
