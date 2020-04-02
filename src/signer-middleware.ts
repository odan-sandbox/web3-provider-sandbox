import { createECDH, ECDH } from "crypto";

import createKeccak from "keccak";

import {
  JsonRpcMiddleware,
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcEngineNextCallback,
  JsonRpcEngineEndCallback
} from "json-rpc-engine";
import { Transaction, TxData } from "ethereumjs-tx";
import secp256k1 from "secp256k1";

export function hash(data: Buffer): Buffer {
  return createKeccak("keccak256")
    .update(data)
    .digest();
}

// nodejs の createECDH("secp256k1") を使う方法は raw digest に sign する方法がなくてだめ

export class KeyPair {
  private readonly ecdh: ECDH;
  constructor(privateKey?: Buffer) {
    this.ecdh = createECDH("secp256k1");
    if (privateKey) {
      this.ecdh.setPrivateKey(privateKey);
    } else {
      this.ecdh.generateKeys();
    }
  }

  public get privateKey(): Buffer {
    return this.ecdh.getPrivateKey();
  }

  public get publicKey(): Buffer {
    return this.ecdh.getPublicKey();
  }

  public get address(): Buffer {
    return hash(this.publicKey).slice(12, 32);
  }
}

export class Signature {
  public readonly buffer: Buffer;
  constructor(data: { signature: Uint8Array; recId: number }) {
    const signature = Buffer.from(data.signature.buffer);

    const recovery = Buffer.alloc(1);
    recovery.writeUInt8((data.recId % 2) + 27, 0);

    this.buffer = Buffer.concat([signature, recovery]);
  }

  public get r(): Buffer {
    return this.buffer.slice(0, 32);
  }
  public get s(): Buffer {
    return this.buffer.slice(32, 64);
  }
  public get v(): number {
    return this.buffer.readUInt8(64);
  }
}

export const createSignerMiddleware = (): JsonRpcMiddleware => {
  const keyPair = new KeyPair();

  return (
    req: JsonRpcRequest<unknown>,
    res: JsonRpcResponse<unknown>,
    next: JsonRpcEngineNextCallback,
    end: JsonRpcEngineEndCallback
  ): void => {
    if (req.method === "eth_accounts") {
      res.result = [`0x${keyPair.address.toString("hex")}`];
      end();
      return;
    }
    if (req.method === "eth_sendTransaction") {
      if (!(req.params instanceof Array)) {
        end({
          code: 400,
          message: "params should be Array"
        });
        return;
      }
      const txParams = req.params[0] as TxData;

      const tx = new Transaction(txParams);
      tx.sign(keyPair.privateKey);
      res.result = `0x${tx.serialize().toString("hex")}`;
      end();
      return;
    }
    if (req.method === "eth_sign") {
      if (!(req.params instanceof Array)) {
        end({
          code: 400,
          message: "params should be Array"
        });
        return;
      }
      const signParams = req.params as [Buffer, Buffer];
      const [, message] = signParams;
      const digest = hash(
        Buffer.from(`\x19Ethereum Signed Message:\n${message.length}${message}`)
      );
      const signature = new Signature(
        secp256k1.ecdsaSign(digest, keyPair.privateKey)
      );
      res.result = `0x${signature.buffer.toString("hex")}`;
      end();
      return;
    }
    next();
  };
};
