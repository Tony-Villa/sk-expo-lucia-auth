import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { discord, lucia } from '$lib/server/lucia';

import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { users, keys } from '$lib/server/db/schema';
import { createAndSetSession, createSession } from '$lib/server/lucia/authUtils';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const redirectUrl = event.cookies.get('redirectUrl')
	const storedState = event.cookies.get('discord_oauth_state') ?? null;
	const isNativeApp = (redirectUrl || '').includes('http')

	if (!code || !state || !storedState || state !== storedState) {
		console.log('Invalid OAuth state or code verifier');
		return new Response('Invalid OAuth state or code verifier', {
			status: 400
		});
	}

	try {
		const tokens = await discord.validateAuthorizationCode(code);
		const discordUserResponse = await fetch("https://discord.com/api/users/@me", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const discordUser: DiscordUser = await discordUserResponse.json();

		const [existingUser] = await db.select().from(users).where(eq(users.email, discordUser.email))

		let session;

		if (existingUser) {
			const [existingKey] = await db
			.select()
			.from(keys)
			.where(
				and(
					eq(keys.providerId, 'discord'), 
					eq(keys.providerUserId, discordUser.id.toString())
					)
				);

			if(!existingKey) {
				const authKeys = existingUser.keys || [];
				authKeys.push('discord');

				await db.transaction(async (trx) => {
					// link discord oauth account to the existing user
					await trx.insert(keys).values({
						providerId: 'discord',
						providerUserId: discordUser.id.toString(),
						userId: existingUser.id
					});

					// Update the user's keys list
					await trx.update(users).set({
						keys: authKeys
					}).where(eq(users.id, existingUser.id));
				});
			}

			if(isNativeApp){
				await createAndSetSession(lucia, existingUser.id, event.cookies)
			} else {
				session = await createSession(existingUser.id);
			}

		} else {
			const userId = generateId(15);

			await db.transaction(async (trx) => {
				await trx.insert(users).values({
					id: userId,
					email: discordUser.email,
					avatarUrl: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
					name: discordUser?.username || null,
					keys: ['discord']
				});

				await trx.insert(keys).values({
					providerId: 'discord',
					providerUserId: discordUser.id.toString(),
					userId
				});
				

			});

			if(isNativeApp){
				await createAndSetSession(lucia, userId, event.cookies)
			} else {
				session = await createSession(userId);
			}
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: `${redirectUrl}?session_token=${session?.id}`
				}
			}
		);
		
	} catch (e) {
		console.error('error: ', e);
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
}


interface DiscordUser {
	id: number;
	login: string;
	email: string;
	avatar: string;
	username: string;
}