const API_BASE = "https://api.freeapi.app/api/v1/users";
const ALLOWED_ENDPOINTS = new Set(["register", "login", "logout", "current-user"]);

function getEndpoint(request: Request): string | null {
  const url = new URL(request.url);
  const endpoint = url.searchParams.get("endpoint");
  if (!endpoint || !ALLOWED_ENDPOINTS.has(endpoint)) {
    return null;
  }
  return endpoint;
}

async function forwardRequest(request: Request) {
  const endpoint = getEndpoint(request);
  if (!endpoint) {
    return Response.json(
      { message: "Invalid endpoint." },
      { status: 400 }
    );
  }

  const cookieHeader = request.headers.get("cookie");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  }

  const method = request.method.toUpperCase();
  const body = method === "GET" ? undefined : JSON.stringify(await request.json());

  const upstream = await fetch(`${API_BASE}/${endpoint}`, {
    method,
    headers,
    body,
  });

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) {
    responseHeaders.set("content-type", contentType);
  }

  const setCookie = (upstream.headers as Headers & { getSetCookie?: () => string[] })
    .getSetCookie?.();
  if (setCookie && setCookie.length > 0) {
    setCookie.forEach((value) => responseHeaders.append("set-cookie", value));
  } else {
    const singleCookie = upstream.headers.get("set-cookie");
    if (singleCookie) {
      responseHeaders.set("set-cookie", singleCookie);
    }
  }

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export async function GET(request: Request) {
  return forwardRequest(request);
}

export async function POST(request: Request) {
  return forwardRequest(request);
}
