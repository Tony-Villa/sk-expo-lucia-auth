import type { Cookies } from '@sveltejs/kit';
import type { Lucia, Session, User } from 'lucia';
import { lucia } from '$lib/server/lucia';
import type { RequestEvent } from '../../../routes/api/$types';

export const GITHUB_OAUTH_STATE_COOKIE_NAME = 'githubOauthState';
export const GOOGLE_OAUTH_STATE_COOKIE_NAME = 'googleOauthState';
export const GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME = 'googleOauthCodeVerifier';

export const createAndSetSession = async (lucia: Lucia, userId: string, cookies: Cookies) => {
	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
};

export const deleteSessionCookie = async (lucia: Lucia, cookies: Cookies) => {
	const sessionCookie = lucia.createBlankSessionCookie();

	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
};

export const createSession = async (userId: string) => {
	return await lucia.createSession(userId, {});
}

export const validateAndGetSession = async(req: Request): Promise<{
	user: User | null
	session: Session | null
}>  => {
	const authorizationHeader = req.headers?.get('Authorization')
	const sessionId = lucia.readBearerToken(authorizationHeader ?? '')

	if (!sessionId) return { user: null, session: null }
	const { user, session } = await lucia.validateSession(sessionId)
	return { user, session }
}

export const invalidateCurrentSession = async (req: Request) => {
	const { session } = await validateAndGetSession(req)
	if (!session) return null

	await lucia.invalidateSession(session.id)
	return true
}

export const getAllSessions = async () => {

}

export const invalidateAllSessions = async () => {

}


