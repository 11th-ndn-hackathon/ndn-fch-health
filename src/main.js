import Koa from "koa";
import bodyParser from "koa-bodyparser";

import { UdpProbe, WsProbe } from "./probe.js";
import { Request } from "./request.js";

const PROBES = {
  udp: UdpProbe,
  wss: WsProbe,
};

const app = new Koa();
app.use(bodyParser({ enableTypes: ["json"] }))
  .use(async (ctx) => {
    if (ctx.URL.pathname !== "/probe") {
      ctx.status = 404;
      return;
    }

    /** @type {import("./probe.js").Probe} */
    let probe;
    try {
      const request = new Request(ctx.request.body);
      const Probe = PROBES[request.transport];
      if (!Probe) {
        throw new Error("unknown transport");
      }
      probe = new Probe(request);
    } catch (err) {
      ctx.status = 400;
      ctx.body = `${err}`;
      return;
    }

    const result = await probe.run();
    ctx.body = result;
  });

app.listen(process.env.PORT ?? 3000);
