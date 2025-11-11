// Simple Node script to test Django session auth flow and org-only endpoint
// Usage:
//   node scripts/test_org_api.mjs "org@example.com" "password123"
// or set env vars:
//   AUTH_EMAIL=... AUTH_PASSWORD=... node scripts/test_org_api.mjs

const API_BASE = "https://truconn.onrender.com";

const email = process.env.AUTH_EMAIL || process.argv[2];
const password = process.env.AUTH_PASSWORD || process.argv[3];

if (!email || !password) {
  console.error("Provide org credentials: node scripts/test_org_api.mjs <email> <password>");
  process.exit(1);
}

function parseSetCookie(setCookieHeaders) {
  const jar = {};
  const headers = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders].filter(Boolean);
  for (const header of headers) {
    const [pair] = header.split(";");
    const [name, value] = pair.split("=");
    if (name && value) {
      jar[name.trim()] = value.trim();
    }
  }
  return jar;
}

function cookieHeaderFromJar(jar) {
  return Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

async function main() {
  let cookieJar = {};

  // 1) Get CSRF cookie
  const csrfRes = await fetch(`${API_BASE}/api/auth/csrf/`, {
    method: "GET",
  });
  const csrfSetCookie = csrfRes.headers.getSetCookie
    ? csrfRes.headers.getSetCookie()
    : csrfRes.headers.get("set-cookie");
  Object.assign(cookieJar, parseSetCookie(csrfSetCookie));
  const csrftoken = cookieJar["csrftoken"];
  if (!csrftoken) {
    console.warn("Warning: csrftoken not set from /api/auth/csrf/. Continuing anyway.");
  }

  // 2) Login (session cookie expected)
  const loginRes = await fetch(`${API_BASE}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(csrftoken ? { "X-CSRFToken": csrftoken } : {}),
      Cookie: cookieHeaderFromJar(cookieJar),
    },
    body: JSON.stringify({ email, password }),
  });
  const loginBody = await loginRes.text();
  if (!loginRes.ok) {
    console.error("Login failed:", loginRes.status, loginBody);
    process.exit(1);
  }
  const loginCookies = loginRes.headers.getSetCookie
    ? loginRes.headers.getSetCookie()
    : loginRes.headers.get("set-cookie");
  Object.assign(cookieJar, parseSetCookie(loginCookies));
  const sessionid = cookieJar["sessionid"];
  if (!sessionid) {
    console.error("No sessionid cookie returned on login.");
    process.exit(1);
  }
  console.log("Login OK. Cookies:", cookieJar);

  // 3) Call org-only endpoint
  const listRes = await fetch(`${API_BASE}/api/organization/citizens/list/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Cookie: cookieHeaderFromJar(cookieJar),
      ...(csrftoken ? { "X-CSRFToken": csrftoken } : {}),
    },
  });
  const listText = await listRes.text();
  console.log("GET /api/organization/citizens/list/ →", listRes.status);
  console.log(listText);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


