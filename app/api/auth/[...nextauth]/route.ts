import NextAuth from "next-auth";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/app/api/client";
const handler = NextAuth({

    providers: [
        CredentialsProvider({
            name: 'credenciales',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "" },
                password: { label: "Contraseña", type: "password", placeholder: "" },
            },
            async authorize(credentials) {
                const { email, password } = credentials as { email: string, password: string };
                const usuario = await prisma.usuario.findFirst({ where: { email } });
                if (usuario && bcrypt.compareSync(password, usuario.password)) {
                    return {
                        email: usuario.email,
                        image: usuario.avatar,
                        name: usuario.nombre,
                        id: usuario.id
                    }
                }
                else
                    throw new Error('redirect')
            },
        }),

    ],
    callbacks: {
        async signIn({ account }) {
            if (account!.provider === "google") {
                return true
            }
            else if (account!.provider === 'credentials') {
                return true
            }
            return false
        }
    },
    pages: {
        signIn: '/login',
        newUser: '/'
    },


})

export { handler as GET, handler as POST };