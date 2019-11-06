import * as wavesProto from '@waves/protobuf-serialization'
import { base58Decode, base58Encode } from '@waves/ts-lib-crypto'
import { ITransaction, TOrder, TTx } from './transactions'
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

const convert = ({ senderPublicKey, fee, timestamp, type, version, chainId, ...rest }: TTx) => {
  const typename = nameByType[type]
  return {
    version,
    type,
    chainId,
    senderPublicKey: base58Decode(senderPublicKey),
    timestamp: Long.fromValue(timestamp),
    fee: Long.fromValue(fee),
    data: typename,
    [typename]: convertTxData(typename, rest)
  }
}

const convertTxData = (typename: keyof typeof typeByName, data: any) => {
  return null as any
}
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
