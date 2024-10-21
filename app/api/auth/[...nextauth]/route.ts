import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          const res = await fetch(`${process.env.API_URL}/teacher/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          });

          const user = await res.json();
          if (res.status !== 200 || !user) {
            throw new Error("Invalid credentials. Please try again.");
          }

          return user;

        } catch (error) {
          console.error("Error during authentication:", error);
          throw new Error("Giriş başarısız kullanıcı adını yada şifrenizi kontrol ediniz.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.name) {
        token.name = session.name;
        token.email = session.email;
        token.surname = session.surname;
        token.phoneNumber = session.phoneNumber;
        token.username = session.username;
        token.role = session.role;
        token.id = session.id;
      }
      return { ...token, ...user };
    },
    async session({ session, user, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
