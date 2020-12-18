import * as wavesProto from '@waves/protobuf-serialization'
import {
  base58Decode,
  base58Encode,
  stringToBytes,
  base64Decode,
  bytesToString,
  base64Encode,
  concat,
  keccak, blake2b
} from '@waves/ts-lib-crypto'
import { binary, schemas, serializePrimitives, parsePrimitives } from '@waves/marshall'
import {
  IAliasTransaction,
  IBurnTransaction,
  ICancelLeaseTransaction,
  TDataEntry,
  IDataTransaction,
  IExchangeTransaction, IInvokeScriptTransaction,
  IIssueTransaction,
  ILeaseTransaction,
  IMassTransferItem,
  IMassTransferTransaction,
  IOrder,
  IReissueTransaction, ISetAssetScriptTransaction,
  ISetScriptTransaction, ISponsorshipTransaction,
  ITransferTransaction,
  TOrder, TRANSACTION_TYPE, TTransactionType,
  TTx, TTypedData, IUpdateAssetInfoTransaction, TDeleteRequest
} from './transactions'
import { base64Prefix, chainIdFromRecipient, fee, isOrder } from './generic'
import Long from 'long'
import { lease } from './transactions/lease'

const invokeScriptCallSchema = {
  ...schemas.txFields.functionCall[1], withLength: {
    toBytes: serializePrimitives.SHORT,
    fromBytes: parsePrimitives.P_SHORT,
  },
}

const recipientFromProto = (recipient: wavesProto.waves.IRecipient, chainId: number): string => {
  if (recipient.alias) {
    return `alias:${String.fromCharCode(chainId)}:${recipient.alias}`
  }
  const rawAddress = concat([1], [chainId], recipient!.publicKeyHash!)
  const checkSum = keccak(blake2b(rawAddress)).slice(0, 4)
  return base58Encode(concat(rawAddress, checkSum))
}

export function txToProtoBytes(obj: TTx): Uint8Array {
  return new Uint8Array(wavesProto.waves.Transaction.encode(txToProto(obj)).finish())
}

export function protoBytesToTx(bytes: Uint8Array): TTx {
  const t = wavesProto.waves.Transaction.decode(bytes)

  let res: any = {
    version: t.version,
    type: typeByName[t.data!] as TTransactionType,
    senderPublicKey: base58Encode(t.senderPublicKey),
    timestamp: t.timestamp.toNumber(),
    fee: t.fee!.amount!.toNumber(),
    // chainId: t.chainId
  }
  if (t.fee!.hasOwnProperty('assetId')) {
    res.feeAssetId = base58Encode(t.fee!.assetId!)
  }

  if (t.hasOwnProperty('chainId')) {
    res.chainId = t.chainId
  }
  switch (t.data) {
    case 'issue':
      res.name = t.issue!.name!
      res.description = t.issue!.description!
      res.quantity = t.issue!.amount!.toString()
      res.decimals = t.issue!.decimals
      res.reissuable = t.issue!.reissuable
      if (t.issue!.hasOwnProperty('script')) {
        res.script = t.issue!.script && base64Prefix(base64Encode(t.issue!.script))
      }
      break
    case 'transfer':
      res.amount = t.transfer!.amount!.amount!.toString()
      res.recipient = recipientFromProto(t.transfer!.recipient!, t.chainId)
      if (t.transfer!.hasOwnProperty('attachment')) {
        res.attachment = t.transfer!.attachment == null ? null : base58Encode(t.transfer!.attachment)
      }
      if (t.transfer!.hasOwnProperty('assetId')) {
        res.assetId = t.transfer!.amount!.assetId == null ? null : base58Encode(t.transfer!.amount!.assetId)
      }
      break
    case 'reissue':
      res.quantity = t.reissue!.assetAmount!.amount!.toString()
      res.assetId = t.reissue!.assetAmount!.assetId == null ? null : base58Encode(t.reissue!.assetAmount!.assetId)
      res.reissuable = t.reissue!.reissuable
      break
    case 'burn':
      res.quantity = t.burn!.assetAmount!.amount!.toString()
      res.assetId = base58Encode(t.burn!.assetAmount!.assetId!)
      break
    case 'exchange':
      res.amount = t.exchange!.amount!.toString()
      res.price = t.exchange!.price!.toString()
      res.buyMatcherFee = t.exchange!.buyMatcherFee!.toString()
      res.sellMatcherFee = t.exchange!.sellMatcherFee!.toString()
      res.order1 = orderFromProto(t.exchange!.orders![0])
      res.order2 = orderFromProto(t.exchange!.orders![1])
      break
    case 'lease':
      res.recipient = recipientFromProto(t.lease!.recipient!, t.chainId)
      res.amount = t.lease!.amount!.toString()
      break
    case 'leaseCancel':
      res.leaseId = base58Encode(t.leaseCancel!.leaseId!)
      break
    case 'createAlias':
      res.alias = t.createAlias!.alias
      break
    case 'massTransfer':
      if (t.massTransfer!.hasOwnProperty('assetId')) {
        res.assetId = t.massTransfer!.assetId == null ? null : base58Encode(t.massTransfer!.assetId)
      }
      if (t.massTransfer!.hasOwnProperty('attachment')) {
        res.attachment = t.massTransfer!.attachment == null ? null : base58Encode(t.massTransfer!.attachment)
      }
      res.transfers = t.massTransfer!.transfers!.map(({ amount, recipient }) => ({
        amount: amount!.toString(),
        recipient: recipientFromProto(recipient!, t.chainId),
      }))
      break
    case 'dataTransaction':
      res.data = t.dataTransaction!.data!.map(de => {
        if (de.hasOwnProperty('binaryValue')) return {
          key: de.key,
          type: 'binary',
          value: base64Prefix(base64Encode(de.binaryValue!)),
        }
        if (de.hasOwnProperty('boolValue')) return { key: de.key, type: 'boolean', value: de.boolValue }
        if (de.hasOwnProperty('intValue')) return { key: de.key, type: 'integer', value: de.intValue!.toString() }
        if (de.hasOwnProperty('stringValue')) return { key: de.key, type: 'string', value: de.stringValue }
        return { key: de.key }
      })
      break
    case 'setScript':
      res.script = t.setScript!.script == null ? null : base64Prefix(base64Encode(t.setScript!.script!))
      break
    case 'sponsorFee':
      res.minSponsoredAssetFee = t.sponsorFee!.minFee!.amount!.toString()
      res.assetId = base58Encode(t.sponsorFee!.minFee!.assetId!)
      break
    case 'setAssetScript':
      res.assetId = base58Encode(t.setAssetScript!.assetId!)
      res.script = base64Prefix(base64Encode(t.setAssetScript!.script!))
      break
    case 'invokeScript':
      res.dApp = recipientFromProto(t.invokeScript!.dApp!, t.chainId)
      if (t.invokeScript!.functionCall! != null) {
        res.call = binary.parserFromSchema(invokeScriptCallSchema)(t.invokeScript!.functionCall!).value //todo: export function call from marshall and use it directly
      }
      res.payment = t.invokeScript!.payments!.map(p => ({
        amount: p.amount!.toString(),
        assetId: p.assetId == null ? null : base58Encode(p.assetId),
      }))
      break
    case 'updateAssetInfo':
      res.assetId = base58Encode(t.updateAssetInfo!.assetId!)
      res.name = t.updateAssetInfo!.name
      res.description = t.updateAssetInfo!.description
      break
    default:
      throw new Error(`Unsupported tx type ${t.data}`)
  }

  return res
}

export function orderToProtoBytes(obj: TOrder): Uint8Array {
  return wavesProto.waves.Order.encode(orderToProto(obj as any)).finish()
}

export function protoBytesToOrder(bytes: Uint8Array) {
  const o = wavesProto.waves.Order.decode(bytes)
  return orderFromProto(o)
}

const getCommonFields = ({ senderPublicKey, fee, timestamp, type, version, ...rest }: TTx) => {
  const typename = nameByType[type]
  let chainId = (rest as any).chainId
  if (chainId == null) {
    const r: any = rest
    let recipient = r.recipient || r.dApp || (r.transfers && r.transfers[0] && r.transfers[0].recipient)
    if (recipient) {
      chainId = chainIdFromRecipient(recipient)
    }
  }
  return {
    version,
    type,
    chainId,
    senderPublicKey: base58Decode(senderPublicKey),
    timestamp: Long.fromValue(timestamp),
    fee: amountToProto(fee, (rest as any).feeAssetId),
    data: typename,
  }
}
const getIssueData = (t: IIssueTransaction): wavesProto.waves.IIssueTransactionData => ({
  name: t.name,
  description: t.description === '' ? null : t.description,
  amount: Long.fromValue(t.quantity),
  decimals: t.decimals === 0 ? null : t.decimals,
  reissuable: t.reissuable ? true : undefined,
  script: t.script == null ? null : scriptToProto(t.script),
})
const getTransferData = (t: ITransferTransaction): wavesProto.waves.ITransferTransactionData => ({
  recipient: recipientToProto(t.recipient),
  amount: amountToProto(t.amount, t.assetId),
  attachment: t.attachment == null || t.attachment == '' ? undefined : base58Decode(t.attachment),
})
const getReissueData = (t: IReissueTransaction): wavesProto.waves.IReissueTransactionData => ({
  assetAmount: amountToProto(t.quantity, t.assetId),
  reissuable: t.reissuable ? true : undefined,
})
const getBurnData = (t: IBurnTransaction): wavesProto.waves.IBurnTransactionData => ({
  assetAmount: amountToProto(t.amount || (t as any).amount, t.assetId),
})
const getExchangeData = (t: IExchangeTransaction): wavesProto.waves.IExchangeTransactionData => ({
  amount: Long.fromValue(t.amount),
  price: Long.fromValue(t.price),
  buyMatcherFee: Long.fromValue(t.buyMatcherFee),
  sellMatcherFee: Long.fromValue(t.sellMatcherFee),
  orders: [orderToProto({ chainId: t.chainId, ...t.order1 }), orderToProto({ chainId: t.chainId, ...t.order2 })],
})
const getLeaseData = (t: ILeaseTransaction): wavesProto.waves.ILeaseTransactionData => ({
  recipient: recipientToProto(t.recipient),
  amount: Long.fromValue(t.amount),
})
const getCancelLeaseData = (t: ICancelLeaseTransaction): wavesProto.waves.ILeaseCancelTransactionData => ({
  leaseId: base58Decode(t.leaseId),
})
const getAliasData = (t: IAliasTransaction): wavesProto.waves.ICreateAliasTransactionData => ({ alias: t.alias })
const getMassTransferData = (t: IMassTransferTransaction): wavesProto.waves.IMassTransferTransactionData => ({
  assetId: t.assetId == null ? null : base58Decode(t.assetId),
  attachment: t.attachment == null || t.attachment == '' ? undefined : base58Decode(t.attachment),
  transfers: t.transfers.map(massTransferItemToProto),
})
const getDataTxData = (t: IDataTransaction): wavesProto.waves.IDataTransactionData => ({
  data: t.data.map(dataEntryToProto),
})
const getSetScriptData = (t: ISetScriptTransaction): wavesProto.waves.ISetScriptTransactionData => ({
  script: t.script == null ? null : scriptToProto(t.script),
})
const getSponsorData = (t: ISponsorshipTransaction): wavesProto.waves.ISponsorFeeTransactionData => ({
  minFee: amountToProto(t.minSponsoredAssetFee, t.assetId),
})
const getSetAssetScriptData = (t: ISetAssetScriptTransaction): wavesProto.waves.ISetAssetScriptTransactionData => ({
  assetId: base58Decode(t.assetId),
  script: t.script == null ? null : scriptToProto(t.script),
})
const getInvokeData = (t: IInvokeScriptTransaction): wavesProto.waves.IInvokeScriptTransactionData => ({
  dApp: recipientToProto(t.dApp),
  functionCall: binary.serializerFromSchema((schemas.invokeScriptSchemaV1 as any).schema[5][1])(t.call), //todo: export function call from marshall and use it directly
  payments: t.payment == null ? null : t.payment.map(({ amount, assetId }) => amountToProto(amount, assetId)),
})

const getUpdateAssetInfoData = (t: IUpdateAssetInfoTransaction): wavesProto.waves.IUpdateAssetInfoTransactionData => {
  return {
    assetId: base58Decode(t.assetId),
    name: t.name,
    description: t.description,
  }
}
export const txToProto = (t: TTx): wavesProto.waves.ITransaction => {

  const common = getCommonFields(t)
  let txData
  switch (t.type) {
    case TRANSACTION_TYPE.ISSUE:
      txData = getIssueData(t)
      break
    case TRANSACTION_TYPE.TRANSFER:
      txData = getTransferData(t)
      break
    case TRANSACTION_TYPE.REISSUE:
      txData = getReissueData(t)
      break
    case TRANSACTION_TYPE.BURN:
      txData = getBurnData(t)
      break
    case TRANSACTION_TYPE.LEASE:
      txData = getLeaseData(t)
      break
    case TRANSACTION_TYPE.CANCEL_LEASE:
      txData = getCancelLeaseData(t)
      break
    case TRANSACTION_TYPE.ALIAS:
      txData = getAliasData(t)
      break
    case TRANSACTION_TYPE.MASS_TRANSFER:
      txData = getMassTransferData(t)
      break
    case TRANSACTION_TYPE.DATA:
      txData = getDataTxData(t)
      break
    case TRANSACTION_TYPE.SET_SCRIPT:
      txData = getSetScriptData(t)
      break
    case TRANSACTION_TYPE.SET_ASSET_SCRIPT:
      txData = getSetAssetScriptData(t)
      break
    case TRANSACTION_TYPE.SPONSORSHIP:
      txData = getSponsorData(t)
      break
    case TRANSACTION_TYPE.EXCHANGE:
      txData = getExchangeData(t)
      break
    case TRANSACTION_TYPE.INVOKE_SCRIPT:
      txData = getInvokeData(t)
      break
    case TRANSACTION_TYPE.UPDATE_ASSET_INFO:
      txData = getUpdateAssetInfoData(t)
      break
  }
  return { ...common, [common.data]: txData }
}
const orderToProto = (o: IOrder & { chainId: number }): wavesProto.waves.IOrder => ({
  chainId: o.chainId,
  senderPublicKey: base58Decode(o.senderPublicKey),
  matcherPublicKey: base58Decode(o.matcherPublicKey),
  assetPair: {
    amountAssetId: o.assetPair.amountAsset == null ? null : base58Decode(o.assetPair.amountAsset),
    priceAssetId: o.assetPair.priceAsset == null ? null : base58Decode(o.assetPair.priceAsset),
  },
  orderSide: o.orderType === 'buy' ? undefined : wavesProto.waves.Order.Side.SELL,
  amount: Long.fromValue(o.amount),
  price: Long.fromValue(o.price),
  timestamp: Long.fromValue(o.timestamp),
  expiration: Long.fromValue(o.expiration),
  matcherFee: amountToProto(o.matcherFee, null),
  version: o.version,
  proofs: o.proofs.map(base58Decode),
})

const orderFromProto = (po: wavesProto.waves.IOrder): TOrder => ({
  version: po.version! as 1 | 2 | 3,
  senderPublicKey: base58Encode(po.senderPublicKey!),
  matcherPublicKey: base58Encode(po.matcherPublicKey!),
  assetPair: {
    amountAsset: po!.assetPair!.amountAssetId == null ? null : base58Encode(po!.assetPair!.amountAssetId),
    priceAsset: po!.assetPair!.priceAssetId == null ? null : base58Encode(po!.assetPair!.priceAssetId),
  },
  // @ts-ignore
  chainId: po.chainId,
  orderType: po.orderSide === wavesProto.waves.Order.Side.BUY ? 'buy' : 'sell',
  amount: po.amount!.toString(),
  price: po.price!.toString(),
  timestamp: po.timestamp!.toNumber(),
  expiration: po.expiration!.toNumber(),
  matcherFee: po.matcherFee!.amount!.toNumber(),
  matcherFeeAssetId: po.matcherFee!.assetId == null ? null : base58Encode(po.matcherFee!.assetId),
})

const recipientToProto = (r: string): wavesProto.waves.IRecipient => ({
  alias: r.startsWith('alias') ? r.slice(8) : undefined,
  publicKeyHash: !r.startsWith('alias') ? base58Decode(r).slice(2, -4) : undefined,
})
const amountToProto = (a: string | number, assetId?: string | null): wavesProto.waves.IAmount => ({
  amount: Long.fromValue(a),
  assetId: assetId == null ? null : base58Decode(assetId),
})
const massTransferItemToProto = (mti: IMassTransferItem): wavesProto.waves.MassTransferTransactionData.ITransfer => ({
  recipient: recipientToProto(mti.recipient),
  amount: Long.fromValue(mti.amount),
})
export const dataEntryToProto = (de: TDataEntry | TDeleteRequest): wavesProto.waves.DataTransactionData.IDataEntry => ({
  key: de.key,
  intValue: de.type === 'integer' ? Long.fromValue(de.value) : undefined,
  boolValue: de.type === 'boolean' ? de.value : undefined,
  binaryValue: de.type === 'binary' ? base64Decode((de.value.startsWith('base64:') ? de.value.slice(7) : de.value)) : undefined,
  stringValue: de.type === 'string' ? de.value : undefined,
})
const scriptToProto = (s: string): Uint8Array => {
  return base64Decode(s.startsWith('base64:') ? s.slice(7) : s)
}

const nameByType = {
  1: 'genesis' as 'genesis',
  2: 'payment' as 'payment',
  3: 'issue' as 'issue',
  4: 'transfer' as 'transfer',
  5: 'reissue' as 'reissue',
  6: 'burn' as 'burn',
  7: 'exchange' as 'exchange',
  8: 'lease' as 'lease',
  9: 'leaseCancel' as 'leaseCancel',
  10: 'createAlias' as 'createAlias',
  11: 'massTransfer' as 'massTransfer',
  12: 'dataTransaction' as 'dataTransaction',
  13: 'setScript' as 'setScript',
  14: 'sponsorFee' as 'sponsorFee',
  15: 'setAssetScript' as 'setAssetScript',
  16: 'invokeScript' as 'invokeScript',
  17: 'updateAssetInfo' as 'updateAssetInfo',
}
const typeByName = {
  'genesis': 1 as 1,
  'payment': 2 as 2,
  'issue': 3 as 3,
  'transfer': 4 as 4,
  'reissue': 5 as 5,
  'burn': 6 as 6,
  'exchange': 7 as 7,
  'lease': 8 as 8,
  'leaseCancel': 9 as 9,
  'createAlias': 10 as 10,
  'massTransfer': 11 as 11,
  'dataTransaction': 12 as 12,
  'setScript': 13 as 13,
  'sponsorFee': 14 as 14,
  'setAssetScript': 15 as 15,
  'invokeScript': 16 as 16,
  'updateAssetInfo': 17 as 17,
}

