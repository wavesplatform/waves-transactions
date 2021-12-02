import { publicKey, verifySignature } from '@waves/ts-lib-crypto'
import { massTransfer } from '../../src'
import {checkSerializeDeserialize, validateTxSignature} from '../../test/utils'
import { massTransferMinimalParams } from '../minimalParams'
import {massTransferTx} from "./expected/mass-transfer.tx";

describe('massTransfer', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = massTransfer({ ...massTransferMinimalParams }, stringSeed)
    expect(tx).toMatchObject({ ...massTransferMinimalParams })
  })

  it('Should throw on transfers not being array', () => {
    const tx = () => massTransfer({ ...massTransferMinimalParams, transfers: null } as any, stringSeed)
    expect(tx).toThrow( "Should contain at least one transfer")
  })

  it('Should get correct signature', () => {
    const tx = massTransfer({ ...massTransferMinimalParams }, stringSeed)
    expect(validateTxSignature(tx, 1)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = massTransfer({ ...massTransferMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(validateTxSignature(tx, 1, 1, publicKey(stringSeed))).toBeTruthy()
    expect(validateTxSignature(tx, 1, 3, publicKey(stringSeed2))).toBeTruthy()
  })

  it('Should throw on transfers with minimal quantity of receivers', () => {
    const transfersList = []
    const t = {recipient: "3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1", amount: 1}
    transfersList.push(t)
    const tx =  massTransfer({ transfers: transfersList}, stringSeed)
    expect(tx.transfers).toMatchObject({ ...transfersList })
  })

  it('Should throw on transfers with zero quantity of receivers', () => {
    const transfersList = []
    //const t = ""
    //transfersList.push(t)
    const tx =  massTransfer({ transfers: transfersList}, stringSeed)
    expect(tx.transfers).toMatchObject({ ...transfersList })
  })

  it('Should throw on transfers with maximal quantity of receivers', () => {
    const transfersList = []
    for (let i = 0; i < 100; i++) {
      const t = {recipient: "3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1", amount: i+1}
      transfersList.push(t)
    }
    const tx =  massTransfer({ transfers: transfersList}, stringSeed)
    expect(tx.transfers).toMatchObject({ ...transfersList })
  })

  it('Should throw on transfers with extra maximal quantity of receivers', () => {
    const transfersList = []
    for (let i = 0; i < 101; i++) {
      const t = {recipient: "3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1", amount: i+1}
      transfersList.push(t)
    }
    const tx =  massTransfer({ transfers: transfersList}, stringSeed)
    expect(tx.transfers).toMatchObject({ ...transfersList })
  })

  it('Should throw on transfers with zero amount', () => {
    const transfersList = []
    const t = {recipient: "3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1", amount: 0}
    transfersList.push(t)
    const tx =  massTransfer({ transfers: transfersList}, stringSeed)
    expect(tx.transfers).toMatchObject({ ...transfersList })
  })

  it('Should throw on transfers with negative amount', () => {
    const transfersList = []
    const t = {recipient: "3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1", amount: -1}
    transfersList.push(t)
    const tx =  massTransfer({ transfers: transfersList}, stringSeed)
    expect(tx.transfers).toMatchObject({ ...transfersList })
  })

});

describe('serialize/deserialize mass transfer tx', () => {

  Object.entries(massTransferTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        checkSerializeDeserialize({Json: Json, Bytes: Bytes});
      }))

});

