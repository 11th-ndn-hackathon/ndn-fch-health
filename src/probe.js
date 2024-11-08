import { consume } from "@ndn/endpoint";
import { Forwarder } from "@ndn/fw";
import { splitHostPort, UdpTransport } from "@ndn/node-transport";
import { Name } from "@ndn/packet";
import { WsTransport } from "@ndn/ws-transport";
import hirestime from "hirestime";
import WebSocket from "ws";

const getNow = hirestime();

/** @typedef {{ ok: boolean; rtt?: number; error?: string; }} ProbeResult */

/** Transport probe. */
export class Probe {
  /**
   * @param {import("./request.js").Request} request
   */
  constructor(request) {
    this.request = request;
    this.fw = Forwarder.create();
    /** @type {import("@ndn/endpoint").ConsumerOptions} */
    this.cOpts = {
      fw: this.fw,
      modifyInterest: {
        mustBeFresh: true,
        hopLimit: 64,
      },
      retx: 1,
    };
  }

  /**
   * Run the probe.
   * @returns {Promise<{ connected: boolean; connectError?: string; probes?: ProbeResult[] }>}
   */
  async run() {
    const result = {
      connected: false,
    };
    try {
      this.face = await this.openFace();
    } catch (err) {
      result.connectError = err.message ?? `${err}`;
      return result;
    }
    result.connected = true;
    this.face.addRoute(new Name(), false);

    result.probes = await Promise.all(this.request.names.map((name) => this.probeName(name)));

    this.face.close();
    return result;
  }

  /**
   * @param {Name} name
   * @returns {Promise<ProbeResult>}
   */
  async probeName(name) {
    try {
      const t0 = getNow();
      await consume(name, this.cOpts);
      const t1 = getNow();
      return {
        ok: true,
        rtt: t1 - t0,
      };
    } catch (err) {
      return {
        ok: false,
        error: `${err}`,
      };
    }
  }

  /**
   * Open the face.
   * @returns {Promise<import("@ndn/fw").FwFace>}
   * @abstract
   */
  async openFace() {
    throw new Error("must override");
  }
}

/** UDP transport probe. */
export class UdpProbe extends Probe {
  /** @override */
  async openFace() {
    return UdpTransport.createFace({
      fw: this.fw,
    }, {
      family: this.request.family,
      ...splitHostPort(this.request.router),
    });
  }
}

/** WebSocket transport probe. */
export class WsProbe extends Probe {
  /** @override */
  async openFace() {
    const ws = new WebSocket(this.request.router, {
      family: this.request.family,
    });
    return WsTransport.createFace({
      fw: this.fw,
    }, ws);
  }
}
