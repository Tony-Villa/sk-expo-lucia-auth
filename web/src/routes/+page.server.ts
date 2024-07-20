import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { deleteSessionCookie } from '$lib/server/lucia/authUtils';
import { lucia } from '$lib/server/lucia';

const redirectUrl = 'http://localhost:5173'

export const load: PageServerLoad = async ({ locals }) => {
  
  return {user: locals, isLoggedIn: locals.session !== null }
};

export const actions = {
	login: async (event) => {
		// TODO log the user in
    const provider = event.url.searchParams.get('provider')
    const authUrl = new URL(`http://localhost:5173/auth/login/${provider}`)
    authUrl.searchParams.set('redirectUrl', redirectUrl)

    throw redirect(303, authUrl.toString())
	},
  logout: async ({ cookies, locals }) => {
		if (!locals.session?.id) return;

		await lucia.invalidateSession(locals.session.id);

		await deleteSessionCookie(lucia, cookies);

		throw redirect(303, '/');
	},
} satisfies Actions;