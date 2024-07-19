import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const keys = sqliteTable(
	'key',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade'
			}),
		providerUserId: text('provider_user_id').notNull(),
		providerId: text('provider_id').notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.providerId, table.providerUserId] })
		};
	}
);