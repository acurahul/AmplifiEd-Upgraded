export type SessionRole = 'admin' | 'tutor' | 'student';

export function setSessionRole(role: SessionRole): void {
  localStorage.setItem('sessionRole', role);
}

export function getSessionRole(): SessionRole | null {
  return localStorage.getItem('sessionRole') as SessionRole | null;
}

export function clearSessionRole(): void {
  localStorage.removeItem('sessionRole');
}