import RpcEngine from "json-rpc-engine";
import providerAsMiddleware from "eth-json-rpc-middleware/providerAsMiddleware";

import { createSignerMiddleware } from "./signer-middleware";
import { JsonRpcPayload, JsonRpcResponse } from "web3-core-helpers";

type Callback = (error: Error | null, result?: JsonRpcResponse) => void;

interface Provider {
  sendAsync(payload: JsonRpcPayload, callback: Callback): void;
}

export class SampleProvider implements Provider {
  private readonly engine: RpcEngine;
  public constructor(baseProvider: Provider) {
    this.engine = new RpcEngine();

    this.engine.push(createSignerMiddleware());
    // this.engine.push(providerAsMiddleware(baseProvider));
  }

  public sendAsync(payload: JsonRpcPayload, callback: Callback): void {
    this.engine.handle(
      {
        jsonrpc: "2.0",
        method: payload.method,
        id: payload.id || this.generateId(),
        params: payload.params
      },
      (err, res) => {
        const error = err === null ? null : new Error(err.message);
        const id = typeof res.id === "string" ? parseInt(res.id) : res.id;

        callback(error, {
          id,
          jsonrpc: res.jsonrpc,
          result: res.result
        });
      }
    );
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1e9);
  }
}
