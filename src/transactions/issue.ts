import { IIssueTransaction, TRANSACTION_TYPE, IIssueParams, WithId, WithSender } from '../transactions'
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
import { addProof, getSenderPublicKey, base64Prefix, convertToPairs, fee, networkByte } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '/Users/siem/IdeaProjects/tx-parse-serialize/dist'

export const issueToBytes = (tx: IIssueTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.ISSUE, tx.version, tx.chainId]),
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
export function issue(params: IIssueParams, seed: TSeedTypes): IIssueTransaction & WithId;
export function issue(paramsOrTx: IIssueParams & WithSender | IIssueTransaction, seed?: TSeedTypes): IIssueTransaction & WithId;
export function issue(paramsOrTx: any, seed?: TSeedTypes): IIssueTransaction & WithId {
  const type = TRANSACTION_TYPE.ISSUE;
  const version = paramsOrTx.version || 2;
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);

  const tx: IIssueTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    name: paramsOrTx.name,
    description: paramsOrTx.description,
    quantity: paramsOrTx.quantity,
    script: paramsOrTx.script == null ? undefined : base64Prefix(paramsOrTx.script)!,
    decimals: paramsOrTx.decimals || 8,
    reissuable: paramsOrTx.reissuable || false,
    fee: fee(paramsOrTx, 100000000),
    timestamp: Date.now(),
    chainId: networkByte(paramsOrTx.chainId, 87),
    proofs: paramsOrTx.proofs || [],
    id: '',
  };

  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i));
  tx.id = hashBytes(bytes);

  return tx
}