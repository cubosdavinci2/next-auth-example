import type {
  OAuthConfig,
  OAuthUserConfig,
} from "./node_modules/@auth/core/src/providers/index";

import type {
  Account,
  InternalOptions,
  LoggerInstance,
  Profile,
  RequestInternal,
  TokenSet,
  User,
} from "./node_modules/@auth/core/src/types";

export interface OnshapeProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  /*
  href: string;
  jsonType: string | null;
  oauth2Scopes: number;
  companyPlan: boolean;
  clientId: string | null;
  roles: string[];
  role: number;
  planGroup: string;
  source: number;
  personalMessageAllowed: boolean;
  invitationState: number;
  isExternal: boolean;
  company: string | null;
  globalPermissions: string | null;
  lastLoginTime: string;
  documentationNameOverride: string | null;
  isLight: boolean;
  isGuest: boolean;
  firstName: string;
  lastName: string;

  documentationName: string | null;
  state: number;
  isOnshapeSupport: boolean;*/
}

export default function Onshape(
  config: OAuthUserConfig<OnshapeProfile> & {
    /** Configuration for usage with [GitHub Enterprise Server](https://docs.github.com/en/enterprise-server/get-started). */
    enterprise?: {
      /** The base URL of your GitHub Enterprise Server instance. */
      baseUrl?: string;
    };
  }
): OAuthConfig<OnshapeProfile> {
  const baseUrl = config?.enterprise?.baseUrl ?? "https://oauth.onshape.com";
  const apiBaseUrl = config?.enterprise?.baseUrl
    ? `${config?.enterprise?.baseUrl}/api/v12`
    : "https://cad.onshape.com";
  return {
    id: "onshape",
    name: "Onshape",
    type: "oauth",
    checks: ["state"],
    //issuer: "https://oauth.onshape.com",
    authorization: {
      url: "https://oauth.onshape.com/oauth/authorize",
      params: {
        scope:
          "OAuth2ReadPII OAuth2Read OAuth2Write OAuth2Delete OAuth2Purchase OAuth2Share",
      },
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    token: "https://oauth.onshape.com/oauth/token",
    /* auth: {
          type: "client_secret_post",
        },*/
    //clientAuthMethod: "client_secret_post",
    /* async request({ client, params }) {
          return await client.tokenRequest({
            url: "https://oauth.onshape.com/oauth/token",
            form: params,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: {
              type: "client_secret_post",
            },
          });
        },
      },*/
    /*async request() {
          console.log("🔐 Custom token exchange");
          console.log("➡️ clientId:", client.clientId);
  
          const body = new URLSearchParams();
          body.set("grant_type", "authorization_code");
          body.set("code", params.code);
          body.set("redirect_uri", "https://your-app.com/auth/callback/onshape");
          body.set("client_id", process.env.AUTH_ONSHAPE_ID);
          body.set("client_secret", process.env.AUTH_ONSHAPE_SECRET);
  
          const response = await fetch("https://oauth.onshape.com/oauth/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
          });
  
          const json = await response.json();
          console.log("🔐 Token response:", json);
  
          if (!response.ok) {
            throw new Error(
              `Token exchange failed: ${response.status} ${JSON.stringify(json)}`
            );
          }
  
          return {
            tokens: {
              access_token: json.access_token,
              refresh_token: json.refresh_token,
              expires_in: json.expires_in,
              token_type: json.token_type,
              scope: json.scope,
            },
          };
        },*/
    userinfo: {
      url: "https://cad.onshape.com/api/users/sessioninfo",
      async request({ tokens, provider }) {
        const response = await fetch(provider.userinfo?.url as URL, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "User-Agent": "authjs",
          },
        });

        // Check for HTTP error status
        if (!response.ok) {
          const errorBody = await response.text(); // Try to read error details
          throw new Error(
            `Failed to fetch user info: ${response.status} ${response.statusText} - ${errorBody}`
          );
        }

        let profile;
        try {
          profile = await response.json(); // Try parsing JSON
        } catch (err) {
          throw new Error(
            `Failed to parse JSON response from user info endpoint: ${err}`
          );
        }

        return profile;
      },
    },
    profile(profile: OnshapeProfile) {
      return {
        id: profile.id.toString(),
        name: profile.name,
        email: profile.email,
        image: profile.image,
      };
    },
    style: { bg: "#24292f", text: "#fff" },
    options: config,
  };
}
