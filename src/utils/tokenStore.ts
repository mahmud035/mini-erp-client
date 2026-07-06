/**
 * In-memory holder for the short-lived access token.
 *
 * The token is NEVER persisted to localStorage/sessionStorage — REST auth rides
 * the httpOnly cookie. We keep the token in a module variable only so the 4C
 * socket.io handshake (which cannot read the httpOnly cookie) can authenticate.
 * It is set on login and on every silent refresh, and cleared on logout / auth loss.
 */
let accessToken: string | null = null

/** Store the latest access token (login + refresh). */
export function setAccessToken(token: string): void {
  accessToken = token
}

/** Read the current access token, or null if unauthenticated. */
export function getAccessToken(): string | null {
  return accessToken
}

/** Drop the access token (logout / refresh failure). */
export function clearAccessToken(): void {
  accessToken = null
}
