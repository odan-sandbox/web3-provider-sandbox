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

    // this.engine.push(providerAsMiddleware(baseProvider));

    this.engine.push(createSignerMiddleware());
  }

  public sendAsync(payload: JsonRpcPayload, callback: Callback): void {
    this.engine.handle(
      {
        jsonrpc: "2.0",
        method: payload.method,
        id: payload.id,
        params: payload.params
      },
      (error, res) => {
        callback(error === null ? null : new Error(error.message), {
          id: res.id as any,
          jsonrpc: res.jsonrpc,
          result: res.result
        });
      }
    );
  }
}
