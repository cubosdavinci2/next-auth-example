import NextAuth from "next-auth";
import "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import Onshape from "./onshape";
/*
import Apple from "@auth/core/providers/apple";
// import Atlassian from "@auth/core/providers/atlassian"
import Auth0 from "@auth/core/providers/auth0";
import AzureB2C from "@auth/core/providers/azure-ad-b2c";
import BankIDNorway from "@auth/core/providers/bankid-no";
import BoxyHQSAML from "@auth/core/providers/boxyhq-saml";
import Cognito from "@auth/core/providers/cognito";
import Coinbase from "@auth/core/providers/coinbase";
import Discord from "@auth/core/providers/discord";
import Dropbox from "@auth/core/providers/dropbox";
import Facebook from "@auth/core/providers/facebook";
import GitLab from "@auth/core/providers/gitlab";
import Google from "@auth/core/providers/google";
import Hubspot from "@auth/core/providers/hubspot";
import Keycloak from "@auth/core/providers/keycloak";
import LinkedIn from "@auth/core/providers/linkedin";
import MicrosoftEntraId from "@auth/core/providers/microsoft-entra-id";
import Netlify from "@auth/core/providers/netlify";
import Okta from "@auth/core/providers/okta";
import Passage from "@auth/core/providers/passage";
import Passkey from "@auth/core/providers/passkey";
import Pinterest from "@auth/core/providers/pinterest";
import Reddit from "@auth/core/providers/reddit";
import Slack from "@auth/core/providers/slack";
import Salesforce from "@auth/core/providers/salesforce";
import Spotify from "@auth/core/providers/spotify";
import Twitch from "@auth/core/providers/twitch";
import Twitter from "@auth/core/providers/twitter";
import Vipps from "@auth/core/providers/vipps";
import WorkOS from "@auth/core/providers/workos";
import Zoom from "@auth/core/providers/zoom";*/
import { createStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";
import vercelKVDriver from "unstorage/drivers/vercel-kv";
import { UnstorageAdapter } from "@auth/unstorage-adapter";

const storage = createStorage({
  driver: process.env.VERCEL
    ? vercelKVDriver({
        url: process.env.AUTH_KV_REST_API_URL,
        token: process.env.AUTH_KV_REST_API_TOKEN,
        env: false,
      })
    : memoryDriver(),
});

// This is the important line
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: UnstorageAdapter(storage),
  providers: [
    GitHub({
      process.env.AUTH_ONSHAPE_ID
      process.env.AUTH_ONSHAPE_ID
    }),
    Onshape({
      clientId: process.env.AUTH_ONSHAPE_ID,
      clientSecret: process.env.AUTH_ONSHAPE_SECRET,
    }),
    /*Apple,
    // Atlassian,
    Auth0,
    AzureB2C,
    BankIDNorway,
    BoxyHQSAML({
      clientId: "dummy",
      clientSecret: "dummy",
      issuer: process.env.AUTH_BOXYHQ_SAML_ISSUER,
    }),
    Cognito,
    Coinbase,
    Discord,
    Dropbox,
    Facebook,

    GitLab,
    Google,
    Hubspot,
    Keycloak({ name: "Keycloak (bob/bob)" }),
    LinkedIn,
    MicrosoftEntraId,
    Netlify,
    Okta,
    Passkey({
      formFields: {
        email: {
          label: "Username",
          required: true,
          autocomplete: "username webauthn",
        },
      },
    }),
    Passage,
    Pinterest,
    Reddit,
    Salesforce,
    Slack,
    Spotify,
    Twitch,
    Twitter,
    Vipps({
      issuer: "https://apitest.vipps.no/access-management-1.0/access/",
    }),
    WorkOS({ connection: process.env.AUTH_WORKOS_CONNECTION! }),
    Zoom,*/
  ],
  basePath: "/auth",
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middleware-example") return !!auth;
      return true;
    },
    jwt({ token, trigger, session, account }) {
      if (trigger === "update") token.name = session.user.name;
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) session.accessToken = token.accessToken;

      return session;
    },
  },
  experimental: { enableWebAuthn: true },
});

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
