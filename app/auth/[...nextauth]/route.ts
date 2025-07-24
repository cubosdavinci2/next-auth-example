//import { handlers } from "auth"
//export const { GET, POST } = handlers

import { handlers } from "auth";
/*
const originalFetch = global.fetch;

global.fetch = async (...args: Parameters<typeof fetch>): Promise<Response> => {
  // getting args values
  const [input, init = {}] = args;

  // url
  const url = typeof input === "string" ? input : input.url;

  // method, headers
  const method = init.method?.toUpperCase?.() || "GET";
  const headers = new Headers(init.headers);

  console.log("FETCH REQUEST...");
  console.log(`🌐 FETCH → ${url}`);
  console.log(`📟 Method → ${method}`);
  console.log(`📢 Headers →`);
  headers.forEach((value, key) => {
    console.log(`   ${key}: ${value}`);
  });

  // Log and unwrap the body if it's present
  if (init.body) {
    if (typeof init.body === "string") {
      try {
        const parsed = JSON.parse(init.body);
        console.log("📋 Body (JSON):", parsed);
      } catch {
        console.log("📗 Body (String):", init.body);
      }
    } else if (init.body instanceof URLSearchParams) {
      console.log("📁 Body (Form):", Object.fromEntries(init.body.entries()));
    } else {
      console.log("📛 Body (Unknown):", init.body);
    }
  }
*/
//let response: Response;
// Clone init so we can safely modify it
/*
  const modifiedInit: RequestInit = { ...init };

  // ✅ Conditionally modify the request
  if (
    url.includes("https://oauth.onshape.com/oauth/token") &&
    method === "POST"
  ) {
    console.log("🐒 Intercepted token request to:", url);
    let bodyParams: URLSearchParams;

    if (init.body instanceof URLSearchParams) {
      bodyParams = init.body;
    } else if (typeof init.body === "string") {
      bodyParams = new URLSearchParams(init.body);
    } else {
      console.warn("Skipping patch: unsupported body type.");
      return await originalFetch(url, init);
    }

    bodyParams.set("client_id", process.env.AUTH_ONSHAPE_ID!);
    bodyParams.set("client_secret", process.env.AUTH_ONSHAPE_SECRET!);

    modifiedInit.headers = {
      ...Object.fromEntries(headers.entries()),
      "Content-Type": "application/x-www-form-urlencoded",
    };
    modifiedInit.body = bodyParams.toString();

    console.log(`📢 Headers →`);
    modifiedInit.headers.forEach((value, key) => {
      console.log(`   ${key}: ${value}`);
    });
    console.log("🐒 Modified Body", modifiedInit.body);
  }
  // 🌀 Call the original fetch with either original or modified init
  const response = await originalFetch(url, modifiedInit);*/

export const { GET, POST } = handlers;
