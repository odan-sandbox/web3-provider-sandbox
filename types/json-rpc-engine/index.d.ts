/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "json-rpc-engine" {
  import SafeEventEmitter from "safe-event-emitter";
  import { IEthereumRpcError } from "eth-json-rpc-errors/@types";
  // copy from json-rpc-engine/src/index.d.ts
  export type JsonRpcVersion = "2.0";

  export type JsonRpcReservedMethod = string;

  export type JsonRpcId = number | string | void;

  type JsonRpcError<T> = IEthereumRpcError<T>;

  interface JsonRpcRequest<T> {
    jsonrpc: JsonRpcVersion;
    method: string;
    id: JsonRpcId;
    params?: T;
  }

  interface JsonRpcNotification<T> extends JsonRpcResponse<T> {
    jsonrpc: JsonRpcVersion;
    params?: T;
  }

  interface JsonRpcResponse<T> {
    result?: any;
    error?: JsonRpcError<any>;
    jsonrpc: JsonRpcVersion;
    id: JsonRpcId;
  }

  interface JsonRpcSuccess<T> extends JsonRpcResponse<T> {
    result: any;
  }

  interface JsonRpcFailure<T> extends JsonRpcResponse<T> {
    error: JsonRpcError<T>;
  }

  type JsonRpcEngineEndCallback = (error?: JsonRpcError<any>) => void;
  type JsonRpcEngineNextCallback = (
    returnFlightCallback?: (done: () => void) => void
  ) => void;

  export interface JsonRpcMiddleware {
    (
      req: JsonRpcRequest<any>,
      res: JsonRpcResponse<any>,
      next: JsonRpcEngineNextCallback,
      end: JsonRpcEngineEndCallback
    ): void;
  }

  class RpcEngine extends SafeEventEmitter {
    push(middleware: JsonRpcMiddleware): void;
    handle: (
      req: JsonRpcRequest<any>,
      callback: (error: JsonRpcError<any>, res: JsonRpcResponse<any>) => void
    ) => void;
  }
  export default RpcEngine;
}
