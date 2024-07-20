// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
			//
			validate: import('@lucia-auth/sveltekit').Validate;
			validateUser: import('@lucia-auth/sveltekit').ValidateUser;
			setSession: import('@lucia-auth/sveltekit').SetSession;
		}
		declare namespace Lucia {
			type Auth = import('$lib/server/auth').Lucia;
			type UserAttributes = import('$lib/server/auth').DatabaseUserAttributes;
		}
		interface PageData {
			// pageMetaTags?: MetaTagsProps;
			isLoggedIn: boolean;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
