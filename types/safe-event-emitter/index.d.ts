declare module "safe-event-emitter" {
  import { EventEmitter } from "events";
  class SafeEventEmitter extends EventEmitter {}

  export = SafeEventEmitter;
}
