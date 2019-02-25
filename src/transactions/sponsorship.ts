import { TRANSACTION_TYPE, WithId, WithSender, ISponsorshipParams, ISponsorshipTransaction } from '../transactions'
import { signBytes, hashBytes } from '@waves/waves-crypto'
import { addProof, getSenderPublicKey, convertToPairs, fee } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'


/* @echo DOCS */
export function sponsorship(params: ISponsorshipParams, seed: TSeedTypes): ISponsorshipTransaction & WithId
export function sponsorship(paramsOrTx: ISponsorshipParams & WithSender | ISponsorshipTransaction, seed?: TSeedTypes): ISponsorshipTransaction & WithId
export function sponsorship(paramsOrTx: any, seed?: TSeedTypes): ISponsorshipTransaction & WithId {
  const type = TRANSACTION_TYPE.SPONSORSHIP
  const version = paramsOrTx.version || 1
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: ISponsorshipTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    minSponsoredAssetFee: paramsOrTx.minSponsoredAssetFee,
    assetId: paramsOrTx.assetId,
    fee: fee(paramsOrTx, 100000000),
    timestamp: Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)

  return tx
}