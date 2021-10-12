/**
 * @module index
 */
import {IInvokeScriptParams, WithId, WithProofs, WithSender} from '../transactions'
import {base58Encode, blake2b, signBytes,} from '@waves/ts-lib-crypto'
import {addProof, convertToPairs, fee, getSenderPublicKey, networkByte, normalizeAssetId} from '../generic'
import {TSeedTypes} from '../types'
import {binary} from '@waves/marshall'
import {validate} from '../validators'
import {txToProtoBytes} from '../proto-serialize'
import {DEFAULT_VERSIONS} from '../defaultVersions'
import {InvokeScriptPayment, InvokeScriptTransaction, TRANSACTION_TYPE} from '@waves/ts-types'

/* @echo DOCS */
export function invokeScript(params: IInvokeScriptParams, seed: TSeedTypes): InvokeScriptTransaction & WithId & WithProofs
export function invokeScript(paramsOrTx: IInvokeScriptParams & WithSender | InvokeScriptTransaction, seed?: TSeedTypes): InvokeScriptTransaction & WithId & WithProofs
export function invokeScript(paramsOrTx: any, seed?: TSeedTypes): InvokeScriptTransaction & WithId & WithProofs{
    const type = TRANSACTION_TYPE.INVOKE_SCRIPT
    const version = paramsOrTx.version || DEFAULT_VERSIONS.INVOKE_SCRIPT
    const seedsAndIndexes = convertToPairs(seed)
    const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

    const tx: InvokeScriptTransaction & WithId & WithProofs = {
        type,
        version,
        senderPublicKey,
        dApp: paramsOrTx.dApp,
        call: callField(paramsOrTx),
        payment: mapPayment(paramsOrTx.payment),
        fee: fee(paramsOrTx, 500000),
        feeAssetId: normalizeAssetId(paramsOrTx.feeAssetId),
        timestamp: paramsOrTx.timestamp || Date.now(),
        chainId: networkByte(paramsOrTx.chainId, 87),
        proofs: paramsOrTx.proofs || [],
        id: '',
    }

    validate.invokeScript(tx)

    const bytes = version > 1 ? txToProtoBytes(tx) : binary.serializeTx(tx)

    seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
    tx.id = base58Encode(base58Encode(blake2b(bytes)))

    return tx
}

const mapPayment = (payments?: InvokeScriptPayment[]): InvokeScriptPayment[] => payments == null
    ? []
    : payments.map(pmt => ({...pmt, assetId: pmt.assetId === 'WAVES' ? null : pmt.assetId}))

const callField = (paramsOrTx: any) => {
    return !!paramsOrTx.call ? {args: paramsOrTx.call.args || [], ...paramsOrTx.call} : null
}
