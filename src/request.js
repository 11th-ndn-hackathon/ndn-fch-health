import { Name } from "@ndn/packet";

export class Request {
  constructor(j) {
    const { transport, family, router, names } = j;
    if (!(
      typeof transport === "string" &&
      (family === 4 || family === 6) &&
      typeof router === "string" &&
      Array.isArray(names) && names.every((name) => typeof name === "string")
    )) {
      throw new Error("bad request");
    }

    /**
     * Transport type.
     * @type {string}
     */
    this.transport = transport;

    /**
     * Address family.
     * @type {4 | 6}
     */
    this.family = family;

    /**
     * Router string.
     * @type {string}
     */
    this.router = router;

    /**
     * Destination names.
     * @type {Name[]}
     */
    this.names = Array.from(names, (name) => new Name(name));
  }
}
