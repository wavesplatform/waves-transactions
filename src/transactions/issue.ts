import { IIssueTransaction, TRANSACTION_TYPE, IIssueParams } from '../transactions'
import {
  concat,
  BASE58_STRING,
  BYTE,
  LEN,
  SHORT,
  STRING,
  LONG,
  signBytes,
  hashBytes,
  BYTES,
  BOOL,
  OPTION, BASE64_STRING
} from 'waves-crypto'
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey, base64Prefix } from '../generic'
import { SeedTypes } from '../types'
import { ValidationResult } from 'waves-crypto/validation'
import { generalValidation, raiseValidationErrors } from '../validation'



export const issueValidation = (tx: IIssueTransaction): ValidationResult => []

export const issueToBytes = (tx: IIssueTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.ISSUE, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  LEN(SHORT)(STRING)(tx.name),
  LEN(SHORT)(STRING)(tx.description),
  LONG(tx.quantity),
  BYTE(tx.decimals),
  BOOL(tx.reissuable),
  LONG(tx.fee),
  LONG(tx.timestamp),
  OPTION(LEN(SHORT)(BASE64_STRING))(tx.script ? tx.script.slice(7) : null),
)

/* @echo DOCS */
export function issue(paramsOrTx: IIssueParams | IIssueTransaction, seed?: SeedTypes): IIssueTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const tx: IIssueTransaction = {
      type: TRANSACTION_TYPE.ISSUE,
      version: 2,
      decimals: 8,
      reissuable: false,
      fee:100000000,
      senderPublicKey,
      timestamp: Date.now(),
      chainId: 'W',
      proofs: [],
      id: '',
        ...paramsOrTx,
      script: paramsOrTx.script == null ? undefined : base64Prefix(paramsOrTx.script)!
    }

    raiseValidationErrors(
      issueValidation(tx)
    )

  const bytes = issueToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? issue(tx, nextSeed) : tx
}