export type SessionRole = 'admin' | 'tutor' | 'student';

export function getSessionRole(): SessionRole | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('amplified_session_role') as SessionRole | null;
}

export function setSessionRole(role: SessionRole): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('amplified_session_role', role);
}

export function clearSessionRole(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('amplified_session_role');
}