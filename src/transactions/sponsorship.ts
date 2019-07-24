/**
 * @module index
 */
import { TRANSACTION_TYPE, WithId, WithSender, ISponsorshipParams, ISponsorshipTransaction } from '../transactions'
import { signBytes, blake2b, base58Encode } from '@waves/ts-lib-crypto'
import { addProof, getSenderPublicKey, convertToPairs, fee } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'
import { validate } from '../validators'


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
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }
  
  validate.sponsorship(tx)
  
  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
  tx.id = base58Encode(blake2b(bytes))

  return tx
}
