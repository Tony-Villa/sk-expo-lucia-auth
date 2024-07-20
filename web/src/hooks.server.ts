import { lucia } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Get the session ID from the cookies
	const sessionId = event.cookies.get(lucia.sessionCookieName);

	// If there's no session ID, set user and session to null and resolve theer quest

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	// If there's a session ID, validate it
	const { session, user } = await lucia.validateSession(sessionId);

	// If the session is fresh (just created due to session expiration extendint), create a new session cookie

	if (session?.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	// If session is not valid, create a blank session cookie to delete a session cookie form the browser
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	// maybe redirect based on authorization (draft center, etc.)

	// Store the user and session in the event.locals, so they can be accessed in endpoints and pages
	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};