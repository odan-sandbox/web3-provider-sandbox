declare module "keccak" {
  import { Transform, TransformOptions } from "stream";
  export class Keccak extends Transform {
    update(data: string | Buffer, encoding?: BufferEncoding): Keccak;
    digest(encoding?: BufferEncoding): Buffer;
  }

  export type KeccakAlgorithm =
    | "keccak224"
    | "keccak256"
    | "keccak384"
    | "keccak512";
  export type Sha3Algorithm = "sha3-224" | "sha3-256" | "sha3-384" | "sha3-512";
  function createKeccak(
    algorithm: KeccakAlgorithm | Sha3Algorithm,
    options?: TransformOptions
  ): Keccak;
  export default createKeccak;
}
