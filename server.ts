import { createServer } from "node:http";
import { handleRequest } from "./mirror/server.mjs";

createServer(handleRequest).listen(Number(process.env.PORT || 3000));
