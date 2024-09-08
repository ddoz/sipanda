import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare, compareSync, hash } from 'bcrypt';

const secret = process.env.NEXTAUTH_SECRET

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "Username",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Password",
                }
            },
            async authorize(credentials : any, req: any): Promise<any> {
                if (!credentials?.username || !credentials?.password) return null;
                const { username, password } = credentials;
                
                try {
                    const user =  await prisma.user.findFirst({
                        where: {
                            email: username
                        }
                    });

                    // console.log(await hash('123654',10));
                    
                    if (user && (await compare(password, user.password))) {
                        return {id: user.id, name: user.name, email: user.email};
                    }else {
                        return null;
                    }
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        session: async ({ session }) => {
            if (session?.user?.email) {
              const { email } = session.user;
              var id = 0;
              const findUserResult = await prisma.user.findFirst({
                where:{
                    email: email
                }
              });

              if (findUserResult) {
                id = findUserResult.id;
              }
              session.user = {
                ...session.user,
                id,
              };
            }
            return Promise.resolve(session);
        },
      },
    secret: secret,
    pages: {
        signIn: '/signin',
    },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }