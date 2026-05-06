// lib/sessionStore.js

export let activeSession = null;

export function setSession(session) {
  activeSession = session;
}

export function getSession() {
  return activeSession;
}

export function clearSession() {
  activeSession = null;
}
