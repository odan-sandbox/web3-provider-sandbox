import { SignOptions } from "secp256k1";
declare module "secp256k1" {
  export function ecdsaSign(
    message: Uint8Array,
    privateKey: Uint8Array,
    options?: SignOptions
  ): { signature: Uint8Array; recId: number };
}
