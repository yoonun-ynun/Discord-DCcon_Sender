import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';

export const { handlers, auth } = NextAuth({
    session: { strategy: 'jwt' },
    providers: [
        Discord({
            authorization: { params: { scope: 'identify email' } },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account?.provider === 'discord' && account.providerAccountId) {
                token.discordId = account.providerAccountId; // 디스코드 고유 ID
            }
            return token;
        },
        async session({ session, token }) {
            // noinspection JSValidateTypes
            session.user = {
                ...(session.user ?? {}),
                ...(token?.discordId ? { discordId: String(token.discordId) } : {}),
            };
            return session;
        },
    },
});
