interface CfProperties {
  country?: string;
  city?: string;
  region?: string;
  latitude?: string | number;
  longitude?: string | number;
}

interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  VITE_API_URL?: string;
  VITE_Web_Trader_UUID?: string;
  VITE_GOOGLE_CLIENT_ID?: string;
}

const DEFAULT_API_URL = "https://houduan-api.onrender.com";
const DEFAULT_TRADER_UUID = "c5e01236-d681-4343-8386-f9e17748f81f";
const DEFAULT_GOOGLE_CLIENT_ID =
  "810723432233-mpgi15h8fvupa2ifqtlmpv5eiih7bvgq.apps.googleusercontent.com";

const shouldTrackPath = (pathname: string) => {
  if (pathname.startsWith("/assets/")) return false;
  if (pathname.startsWith("/system")) return false;
  if (pathname === "/login") return false;
  return true;
};

const trackVisit = (
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  url: URL
) => {
  if (!shouldTrackPath(url.pathname)) return;

  const cf = (request as Request & { cf?: CfProperties }).cf;
  const apiUrl = env.VITE_API_URL || DEFAULT_API_URL;
  const traderUuid = env.VITE_Web_Trader_UUID || DEFAULT_TRADER_UUID;
  const path = url.pathname || "/";

  const payload = {
    ip_address: request.headers.get("CF-Connecting-IP") || "",
    country: cf?.country || "",
    city: cf?.city || "",
    region: cf?.region || "",
    latitude: cf?.latitude ?? null,
    longitude: cf?.longitude ?? null,
    path,
    visit_host: url.host,
    visit_url: `${url.origin}${path}`,
    user_agent: request.headers.get("User-Agent") || "",
    trader_uuid: traderUuid,
  };

  ctx.waitUntil(
    fetch(`${apiUrl}/api/web/track-visit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Web-Trader-UUID": traderUuid,
      },
      body: JSON.stringify(payload),
    }).catch(() => undefined)
  );
};

const buildEnvScript = (env: Env) => `
<script>
  window.__ENV__ = {
    VITE_API_URL: ${JSON.stringify(env.VITE_API_URL || DEFAULT_API_URL)},
    VITE_Web_Trader_UUID: ${JSON.stringify(env.VITE_Web_Trader_UUID || DEFAULT_TRADER_UUID)},
    VITE_GOOGLE_CLIENT_ID: ${JSON.stringify(env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID)}
  };
  if (typeof window !== 'undefined' && window.__ENV__) {
    Object.defineProperty(window, '__VITE_ENV__', {
      value: window.__ENV__,
      writable: false,
      configurable: false
    });
  }
</script>
`;

const injectHtmlEnv = (html: string, env: Env) =>
  html.replace("</head>", `${buildEnvScript(env)}</head>`);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // www 统一跳转到主域名（需先在 Cloudflare DNS 添加 www CNAME 记录）
    if (url.hostname === "www.stevencress.com") {
      url.hostname = "stevencress.com";
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname.startsWith("/api/")) {
      if (url.pathname === "/api/name") {
        return new Response(JSON.stringify({ name: "Cloudflare" }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response("API Not Found", { status: 404 });
    }

    if (env.ASSETS) {
      try {
        const response = await env.ASSETS.fetch(request);

        if (
          response.status === 200 &&
          response.headers.get("content-type")?.includes("text/html")
        ) {
          trackVisit(request, env, ctx, url);
          const html = injectHtmlEnv(await response.text(), env);
          const newHeaders = new Headers(response.headers);
          newHeaders.set("Content-Type", "text/html; charset=utf-8");
          return new Response(html, { headers: newHeaders });
        }

        if (response.status === 404) {
          const indexRequest = new Request(new URL("/index.html", request.url), request);
          const indexResponse = await env.ASSETS.fetch(indexRequest);

          if (indexResponse.status === 200) {
            trackVisit(request, env, ctx, url);
            const html = injectHtmlEnv(await indexResponse.text(), env);
            const newHeaders = new Headers(indexResponse.headers);
            newHeaders.set("Content-Type", "text/html; charset=utf-8");
            return new Response(html, { headers: newHeaders });
          }
          return indexResponse;
        }

        return response;
      } catch (error) {
        console.error("Error fetching assets:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    return new Response("Not Found - ASSETS binding not available", { status: 404 });
  },
};
