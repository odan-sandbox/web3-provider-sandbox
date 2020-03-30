declare module "eth-json-rpc-middleware" {}
declare module "eth-json-rpc-middleware/providerAsMiddleware" {
  import { Provider } from "ethereum-protocol";
  import { JsonRpcMiddleware } from "json-rpc-engine";

  function providerAsMiddleware(provider: Provider): JsonRpcMiddleware;
  export default providerAsMiddleware;
}
