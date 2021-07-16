import { Name } from "@ndn/packet";

export class Request {
  constructor(j) {
    const { transport, family, router, names } = j;
    if (!(
      typeof transport === "string" &&
      typeof family === "number" && [4, 6].includes(family) &&
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
    this.family = (/** @type {any} */ family);

    /**
     * Router string.
     * @type {string}
     */
    this.router = router;

    /**
     * Destination names.
     * @type {Name[]}
     */
    this.names = names.map((name) => new Name(name));
  }
}
