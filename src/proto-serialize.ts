import * as wavesProto from '@waves/protobuf-serialization'
import { base58Decode, base58Encode, stringToBytes, base64Decode } from '@waves/ts-lib-crypto'
import { binary, schemas } from '@waves/marshall'
import {
  IAliasTransaction,
  IBurnTransaction,
  ICancelLeaseTransaction,
  IDataEntry,
  IDataTransaction,
  IExchangeTransaction, IInvokeScriptTransaction,
  IIssueTransaction,
  ILeaseTransaction,
  IMassTransferItem,
  IMassTransferTransaction,
  IOrder,
  IReissueTransaction, ISetAssetScriptTransaction,
  ISetScriptTransaction, ISponsorshipTransaction,
  ITransaction,
  ITransferTransaction,
  TOrder,
  TTx
} from './transactions'
import { isOrder } from './generic'
import Long from 'long'

export function serializeToProtoBytes(obj: TTx | TOrder): Uint8Array {
  if (isOrder(obj)) return null as any
  const converted = convert(obj)
  return wavesProto.waves.Transaction.encode(converted as any).finish()
}

export function parseProtoBytes(bytes: Uint8Array) {
  const { senderPublicKey, fee, timestamp, data, version, ...rest } = wavesProto.waves.Transaction.decode(bytes)

  return {
    version,
    type: typeByName[data!],
    senderPublicKey: base58Encode(senderPublicKey),
    timestamp: timestamp.toString(),
    fee,
    ...rest[data!]
  }
}

const convertCommon = ({ senderPublicKey, fee, timestamp, type, version, chainId, ...rest }: TTx) => {
  const typename = nameByType[type]
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
  name: stringToBytes(t.name),
  description: stringToBytes(t.description),
  amount: Long.fromValue(t.quantity),
  decimals: t.decimals,
  reissuable: t.reissuable,
  script: t.script == null ? null : scriptToProto(t.script),
})
const getTransferData = (t: ITransferTransaction): wavesProto.waves.ITransferTransactionData => ({
  recipient: recipientToProto(t.recipient),
  amount: amountToProto(t.amount, t.assetId),
  attachment: t.attachment == null ? null : base58Decode(t.attachment)
})
const getReissueData = (t: IReissueTransaction): wavesProto.waves.IReissueTransactionData => ({
  assetAmount: amountToProto(t.quantity, t.assetId),
  reissuable: t.reissuable,
})
const getBurnData = (t: IBurnTransaction): wavesProto.waves.IBurnTransactionData => ({
  assetAmount: amountToProto(t.quantity, t.assetId)
})
const getExchangeData = (t: IExchangeTransaction): wavesProto.waves.IExchangeTransactionData => ({
  amount: Long.fromValue(t.amount),
  price: Long.fromValue(t.price),
  buyMatcherFee: Long.fromValue(t.buyMatcherFee),
  sellMatcherFee: Long.fromValue(t.sellMatcherFee),
  orders: [orderToProto(t.order1), orderToProto(t.order2)],
})
const getLeaseData = (t: ILeaseTransaction): wavesProto.waves.ILeaseTransactionData => ({
  recipient: recipientToProto(t.recipient),
  amount: Long.fromValue(t.amount)
})
const getCancelLeaseData = (t: ICancelLeaseTransaction): wavesProto.waves.ILeaseCancelTransactionData => ({
  leaseId: base58Decode(t.leaseId)
})
const getAliasData = (t: IAliasTransaction): wavesProto.waves.ICreateAliasTransactionData => ({ alias: t.alias })
const getMassTransferData = (t: IMassTransferTransaction): wavesProto.waves.IMassTransferTransactionData => ({
  assetId: t.assetId == null ? null : base58Decode(t.assetId),
  attachment: base58Decode(t.attachment),
  transfers: t.transfers.map(massTransferItemToProto)
})
const getDataTxData = (t: IDataTransaction): wavesProto.waves.IDataTransactionData => ({
  data: t.data.map(dataEntryToProto)
})
const getSetScriptData = (t: ISetScriptTransaction): wavesProto.waves.ISetScriptTransactionData => ({
  script: t.script == null ? null : scriptToProto(t.script)
})
const getSponsorData = (t: ISponsorshipTransaction): wavesProto.waves.ISponsorFeeTransactionData => ({
  minFee: amountToProto(t.minSponsoredAssetFee, t.assetId)
})
const getSetAssetScriptData = (t: ISetAssetScriptTransaction): wavesProto.waves.ISetAssetScriptTransactionData => ({
  assetId: base58Decode(t.assetId),
  script: t.script == null ? null : scriptToProto(t.script)
})
const getInvokeData = (t: IInvokeScriptTransaction): wavesProto.waves.IInvokeScriptTransactionData => ({
  dApp: recipientToProto(t.dApp),
  functionCall: t.call == null ? null : binary.serializerFromSchema((schemas.invokeScriptSchemaV1 as any).schema[5][1])(t.call), //todo: export function call from marshall and use it directly
  payments: t.payment == null ? null : t.payment.map(({ amount, assetId }) => amountToProto(amount, assetId))
})

const orderToProto = (o: IOrder): wavesProto.waves.IOrder => ({
  chainId: (o as any).chainId,
  senderPublicKey: base58Decode(o.senderPublicKey),
  matcherPublicKey: base58Decode(o.matcherPublicKey),
  assetPair: {
    amountAssetId: o.assetPair.amountAsset == null ? null : base58Decode(o.assetPair.amountAsset),
    priceAssetId: o.assetPair.priceAsset == null ? null : base58Decode(o.assetPair.priceAsset)
  },
  orderSide: o.orderType === "buy" ? wavesProto.waves.Order.Side.BUY :  wavesProto.waves.Order.Side.SELL,
  amount: Long.fromValue(o.amount),
  price: Long.fromValue(o.price),
  timestamp: Long.fromValue(o.timestamp),
  expiration: Long.fromValue(o.expiration),
  matcherFee: amountToProto(o.matcherFee, null),
  version: o.version,
  proofs: o.proofs.map(base58Decode),
})
const recipientToProto = (r: string): wavesProto.waves.IRecipient => ({
  alias: r.startsWith('alias') ? r : undefined,
  address: !r.startsWith('alias') ? base58Decode(r) : undefined
})
const amountToProto = (a: string | number, assetId?: string | null): wavesProto.waves.IAmount => ({
  amount: Long.fromValue(a),
  assetId: assetId == null ? null : base58Decode(assetId)
})
const massTransferItemToProto = (mti: IMassTransferItem): wavesProto.waves.MassTransferTransactionData.ITransfer => ({
  address: recipientToProto(mti.recipient),
  amount: Long.fromValue(mti.amount)
})
const dataEntryToProto = (de: IDataEntry): wavesProto.waves.DataTransactionData.IDataEntry => ({
  key: de.key,
  intValue: de.type === 'integer' ? Long.fromValue(de.value as number) : undefined,
  boolValue: de.type === 'boolean' ? de.value as boolean : undefined,
  binaryValue: de.type === 'binary' ? base64Decode(de.value as string) : undefined,
  stringValue: de.type === 'string' ? de.value as string : undefined,
})
const scriptToProto = (s: string): wavesProto.waves.IScript => ({
  bytes: base64Decode(s)
})

const nameByType = {
  1: "genesis" as "genesis",
  2: "payment" as "payment",
  3: "issue" as "issue",
  4: "transfer" as "transfer",
  5: "reissue" as "reissue",
  6: "burn" as "burn",
  7: "exchange" as "exchange",
  8: "lease" as "lease",
  9: "leaseCancel" as "leaseCancel",
  10: "createAlias" as "createAlias",
  11: "massTransfer" as "massTransfer",
  12: "dataTransaction" as "dataTransaction",
  13: "setScript" as "setScript",
  14: "sponsorFee" as "sponsorFee",
  15: "setAssetScript" as "setAssetScript",
  16: "invokeScript" as "invokeScript",
}
const typeByName = {
  "genesis": 1 as 1,
  "payment": 2 as 2,
  "issue": 3 as 3,
  "transfer": 4 as 4,
  "reissue": 5 as 5,
  "burn": 6 as 6,
  "exchange": 7 as 7,
  "lease": 8 as 8,
  "leaseCancel": 9 as 9,
  "createAlias": 10 as 10,
  "massTransfer": 11 as 11,
  "dataTransaction": 12 as 12,
  "setScript": 13 as 13,
  "sponsorFee": 14 as 14,
  "setAssetScript": 15 as 15,
  "invokeScript": 16 as 16,
}

const fieldsToConvert = ['fee', 'timestamp', 'amount', 'quantity']
const convertToLong = (tx: TTx): ITransaction<Long> => {
  const go = (obj: any, convert: boolean = false): ITransaction<Long> => {
    if (Array.isArray(obj)) {
      return obj.map(item => go(item)) as any
    } else if (typeof obj === 'object') {
      return Object.entries(obj).reduce((acc, [k, v]) => {
        const c = fieldsToConvert.includes(k)
        acc[k] = go(v, c)
        return acc
      }, {} as any)
    } else {
      return convert ? Long.fromValue(obj) : obj
    }
  }
  return go(tx)
}
