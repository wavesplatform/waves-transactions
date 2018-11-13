import { TransactionType, LeaseTransaction } from "../transactions"
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey } from "../generic"
import { SeedTypes, Params} from "../types";
import { ValidationResult } from "waves-crypto/validation";
import { generalValidation, raiseValidationErrors } from "../validation";
import { VALIDATOR_MAP } from "../schemas";

export interface LeaseParams extends Params {
  recipient: string
  amount: number
  fee?: number
  timestamp?: number
}

export const leaseValidation = (tx: LeaseTransaction): ValidationResult => []

export const leaseToBytes = (tx: LeaseTransaction): Uint8Array => concat(
  BYTES([TransactionType.Lease, tx.version, 0]),
  BASE58_STRING(tx.senderPublicKey),
  BASE58_STRING(tx.recipient),
  LONG(tx.amount),
  LONG(tx.fee),
  LONG(tx.timestamp),
)

/* @echo DOCS */
export function lease(paramsOrTx: LeaseParams | LeaseTransaction, seed?: SeedTypes): LeaseTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const tx: LeaseTransaction =  {
      type: TransactionType.Lease,
      version: 2,
      fee: 100000,
      senderPublicKey,
      timestamp:Date.now(),
      proofs: [],
      id: '',
    ...paramsOrTx
    }

  raiseValidationErrors(
    generalValidation(tx, VALIDATOR_MAP['LeaseTransaction']),
    leaseValidation(tx)
  )

  const bytes = leaseToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? lease(tx, nextSeed) : tx
}