import { handleRequest } from "../mirror/server.mjs";

export default function handler(req, res) {
  const url = new URL(req.url || "/", "http://localhost");
  const sitePath = url.searchParams.get("sitePath");
  if (sitePath !== null) {
    url.searchParams.delete("sitePath");
    req.url = `/${sitePath}${url.search}`;
  }
  return handleRequest(req, res);
}
