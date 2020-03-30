import RpcEngine from "json-rpc-engine";
import providerAsMiddleware from "eth-json-rpc-middleware/providerAsMiddleware";
import { Provider } from "ethereum-protocol";

export class SampleProvider /*implements Provider*/ {
  private readonly engine: RpcEngine;
  public constructor(baseProvider: Provider) {
    this.engine = new RpcEngine();

    this.engine.push(providerAsMiddleware(baseProvider));
  }
}
