import * as http from "http";

import { CasClient } from "../src/Cas";

describe("CasClient", () => {
  let mockServer: any;
  let casClient: CasClient;

  const contentHash =
    "0xcb2402ae09412ffb174e20aa741a7ec0b82338a9a471b4f848e2c9684fcd6a21";

  const contentObject = {
    first: "Ada",
    born: 1999,
    last: "Lovelace"
  };

  const contentBuffer = Buffer.from(JSON.stringify(contentObject));

  const casServerPort = 5001;

  describe("constructor", () => {
    it("should accept a REST API Endpoint ", async () => {
      casClient = new CasClient("http://localhost:5001/sidetree/v0/cas");
      expect(casClient).toBeDefined();
    });
  });

  describe("write", () => {
    beforeAll(() => {
      mockServer = http
        .createServer((req: any, res: any) => {
          expect(req).toBeDefined();
          const response = JSON.stringify(
            {
              hash: contentHash
            },
            null,
            2
          );
          res.write(response);
          res.end();
        })
        .listen(casServerPort);
    });

    it("should return a promise for a hash from a buffer", async () => {
      const writeResult = await casClient.write(contentBuffer);
      expect(writeResult).toBe(contentHash);
    });

    afterAll(() => {
      mockServer.close();
    });
  });

  describe("read", () => {
    beforeAll(() => {
      mockServer = http
        .createServer((req: any, res: any) => {
          expect(req).toBeDefined();
          const response = contentBuffer;
          res.write(response);
          res.end();
        })
        .listen(casServerPort);
    });

    it("should return a promise for a buffer from a hash", async () => {
      const readResult = await casClient.read(contentHash);
      expect(readResult.toString()).toEqual(JSON.stringify(contentObject));
    });

    afterAll(() => {
      mockServer.close();
    });
  });
});
