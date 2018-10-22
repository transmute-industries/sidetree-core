import * as http from "http";

import { BlockchainClient } from "../src/Blockchain";
import Block from "../src/Block";

describe("CasClient", () => {
  let mockServer: any;
  let blockchainClient: BlockchainClient;

  const anchorFileHash =
    "0xcb2402ae09412ffb174e20aa741a7ec0b82338a9a471b4f848e2c9684fcd6a21";

  const block: Block = {
    blockNumber: 0,
    blockHash: "0x123"
  };

  const blockchainServerPort = 8545;

  describe("constructor", () => {
    it("should accept a REST API Endpoint ", async () => {
      blockchainClient = new BlockchainClient(
        "http://localhost:8545/sidetree/v0/blockchain"
      );
      expect(blockchainClient).toBeDefined();
    });
  });

  describe("write", () => {
    beforeAll(() => {
      mockServer = http
        .createServer((req: any, res: any) => {
          expect(req).toBeDefined();
          // TODO: Define a standard response object that is blockchain agnostic
          const response = JSON.stringify(
            {
              success: true
            },
            null,
            2
          );
          res.write(response);
          res.end();
        })
        .listen(blockchainServerPort);
    });

    it("should return a promise for undefined from an anchorFileHash", async () => {
      const transactionObject = await blockchainClient.write(anchorFileHash);
      expect(transactionObject).toBe(undefined);
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
          // TODO: Define a standard transactions array format that is blockchain agnostic
          const response = JSON.stringify(
            {
              transactions: [
                {
                  id: 0
                }
              ]
            },
            null,
            2
          );
          res.write(response);
          res.end();
        })
        .listen(blockchainServerPort);
    });

    it("should return a promise for a transactions collection from an afterTransaction integer", async () => {
      const afterTransaction = 23;
      const { transactions } = await blockchainClient.read(afterTransaction);
      expect(transactions.length).toBe(1);
      expect((transactions[0] as any).id).toBe(0);
    });

    afterAll(() => {
      mockServer.close();
    });
  });

  describe("getLastBlock", () => {
    beforeAll(() => {
      mockServer = http
        .createServer((req: any, res: any) => {
          expect(req).toBeDefined();

          const response = JSON.stringify(block, null, 2);
          res.write(response);
          res.end();
        })
        .listen(blockchainServerPort);
    });

    it("should return a promise for a lastBlock Block", async () => {
      const block: Block = await blockchainClient.getLastBlock();
      expect(block.blockNumber).toBe(0);
      expect(block.blockHash).toBe("0x123");
    });

    afterAll(() => {
      mockServer.close();
    });
  });
});
