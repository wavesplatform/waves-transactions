/**
 * @module index
 */
import {
    IInvokeScriptCall,
    IInvokeScriptParams,
    IInvokeScriptPayment,
    IInvokeScriptTransaction, ITransaction,
    TRANSACTION_TYPE,
    WithId,
    WithSender
} from '../transactions'
import {base58Encode, blake2b, signBytes,} from '@waves/ts-lib-crypto'
import {addProof, convertToPairs, fee, getSenderPublicKey, networkByte, normalizeAssetId} from '../generic'
import {TSeedTypes} from '../types'
import {binary} from '@waves/marshall'
import {validate} from '../validators'
import {txToProtoBytes} from '../proto-serialize'
import {DEFAULT_VERSIONS} from '../defaultVersions'


/* @echo DOCS */
export function invokeScript(params: IInvokeScriptParams, seed: TSeedTypes): IInvokeScriptTransaction & WithId
export function invokeScript(paramsOrTx: IInvokeScriptParams & WithSender | IInvokeScriptTransaction, seed?: TSeedTypes): IInvokeScriptTransaction & WithId
export function invokeScript(paramsOrTx: any, seed?: TSeedTypes): IInvokeScriptTransaction & WithId {
    const type = TRANSACTION_TYPE.INVOKE_SCRIPT
    const version = paramsOrTx.version || DEFAULT_VERSIONS.INVOKE_SCRIPT
    const seedsAndIndexes = convertToPairs(seed)
    const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

    let tx: IInvokeScriptTransaction & WithId | IInvokeScriptTransactionV3 & WithId = {
        type,
        version,
        senderPublicKey,
        dApp: paramsOrTx.dApp,
        call: paramsOrTx.call && {args: [], ...paramsOrTx.call},
        payment: mapPayment(paramsOrTx.payment),
        fee: fee(paramsOrTx, 500000),
        feeAssetId: normalizeAssetId(paramsOrTx.feeAssetId),
        timestamp: paramsOrTx.timestamp || Date.now(),
        chainId: networkByte(paramsOrTx.chainId, 87),
        proofs: paramsOrTx.proofs || [],
        id: '',
    }

    if (version === 3) {
        tx = {
            ...tx,
            extraFeePerStep: paramsOrTx.extraFeePerStep || 1,
        }
        validate.invokeV3Script(tx)
    } else validate.invokeScript(tx)

    const bytes = version > 1 ? txToProtoBytes(tx) : binary.serializeTx(tx)

    seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
    tx.id = base58Encode(base58Encode(blake2b(bytes)))

    return tx
}

const mapPayment = (payments?: IInvokeScriptPayment[]): IInvokeScriptPayment[] => payments == null
    ? []
    : payments.map(pmt => ({...pmt, assetId: pmt.assetId === 'WAVES' ? null : pmt.assetId}))

export type IInvokeScriptTransactionV3 = IInvokeScriptTransaction & {
    extraFeePerStep: number
}
