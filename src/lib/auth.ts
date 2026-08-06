import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

/**
 * Configuracao do Auth.js (NextAuth).
 * Suporta autenticacao por credenciais (email/senha) e Google OAuth.
 */
export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  // Adapter para persistencia no Prisma
  adapter: PrismaAdapter(prisma),

  // Providers de autenticacao
  providers: [
    // Autenticacao por credenciais (email + senha)
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },

      /**
       * Funcao de autorizacao personalizada.
       * Valida credenciais contra o banco de dados.
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Busca o usuario pelo email
        const usuario = await prisma.usuario.findUnique({
          where: {
            email: credentials.email as string,
          },
          include: {
            cliente: true,
            profissional: true,
          },
        });

        // Verifica se o usuario existe e esta ativo
        if (!usuario || !usuario.ativo) {
          return null;
        }

        // Verifica a senha
        const senhaValida = await bcrypt.compare(
          credentials.password as string,
          usuario.senha
        );

        if (!senhaValida) {
          return null;
        }

        // Retorna os dados do usuario para a sessao
        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nome,
          image: usuario.avatar,
          role: usuario.role,
        };
      },
    }),
  ],

  // Estrategia de sessao
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },

  // Paginas personalizadas
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Callbacks personalizados
  callbacks: {
    /**
     * Callback JWT - Adiciona dados extras ao token.
     */
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },

    /**
     * Callback Session - Expoe dados do token na sessao.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  // Eventos personalizados
  events: {
    /**
     * Evento apos o login bem-sucedido.
     * Utilizado para logging ou analytics.
     */
    async signIn({ user }) {
      console.log(`Login realizado: ${user.email}`);
    },

    /**
     * Evento apos o logout.
     */
    async signOut() {
      console.log("Logout realizado");
    },
  },
});

/**
 * Tipagem estendida para a sessao do Auth.js.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      role?: string;
    };
  }

  interface JWT {
    id?: string;
    role?: string;
  }
}
