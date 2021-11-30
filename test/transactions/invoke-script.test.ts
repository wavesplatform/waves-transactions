import {base16Encode, base64Decode, publicKey} from '@waves/ts-lib-crypto'
import { invokeScriptMinimalParams } from '../minimalParams'
import { invokeScript } from '../../src/transactions/invoke-script'
import { IInvokeScriptParams } from '../../src'
import {deleteProofsAndId, validateTxSignature} from '../../test/utils'
import {protoBytesToTx, txToProtoBytes} from "../../src/proto-serialize";
import {invokeScriptTx} from "./expected/invoke-script.tx";

describe('invokeScript', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = invokeScript({ ...invokeScriptMinimalParams }, stringSeed)
    expect(tx).toMatchObject({ ...invokeScriptMinimalParams })
  })

  it('should build from minimal set of params for tx version 1', () => {
    const tx = invokeScript({ version: 1 , ...invokeScriptMinimalParams,}, stringSeed)
    console.log(tx)
    expect(tx).toMatchObject({ ...invokeScriptMinimalParams })
  })


  it('should build from minimal set of params with payment', () => {
    const tx = invokeScript({ ...invokeScriptMinimalParams, payment: [{ amount: 100, assetId: null }] }, stringSeed)
    expect(tx).toMatchObject({ ...invokeScriptMinimalParams })
  })

  it('should build without args', () => {
    const params: IInvokeScriptParams = {
      dApp: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
      call: {
        function: 'foo',
      },
    }
    const tx = invokeScript(params, stringSeed)
    expect(tx).toMatchObject({
      dApp: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
      call: {
        function: 'foo',
        args: [],
      },
    })
  })

  it('should build from minimal set of params with additional properties', () => {
    const tx = invokeScript({ ...invokeScriptMinimalParams, a: 10000 } as any, stringSeed)
    expect(tx).toMatchObject({ ...invokeScriptMinimalParams })
  })

  it('Should get correct signature', () => {
    const tx = invokeScript({ ...invokeScriptMinimalParams }, stringSeed)
    expect(validateTxSignature(tx, 1)).toBeTruthy()
  })

  it('Should sign already signed', () => {
    let tx = invokeScript({ ...invokeScriptMinimalParams }, stringSeed)
    tx = invokeScript(tx, stringSeed)
    expect(validateTxSignature(tx, 1, 1)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = invokeScript({
      ...invokeScriptMinimalParams,
      payment: [{ amount: 100, assetId: null }]
    }, [null, stringSeed, null, stringSeed2])

    expect(validateTxSignature(tx, 1, 1, publicKey(stringSeed))).toBeTruthy()
    expect(validateTxSignature(tx, 1, 3, publicKey(stringSeed2))).toBeTruthy()
  })

  const testInvokeScriptParams= {
    dApp: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
    call: {
      function: 'foo',
      args: [
        {
          type: 'binary',
          value: 'base64:AQa3b8tH',
        },
        {
          type: 'boolean',
          value: true,
        },
        {
          type: 'integer',
          value: 1234567890,
        },
        {
          type: 'string',
          value: "Abra Shvabra Kadabra",
        },
        {
          type: 'list',
          value: [
            {
              type: 'binary',
              value: 'base64:UmlkZQ=='
            },
            {
              type: 'boolean',
              value: false
            },
            {
              type: 'integer',
              value: 223322
            },
            {
              type: 'string',
              value: "Porto Franko"
            }
          ]
        }
      ]
    },
  }

  it('Should build with minimal fee', () => {
    const tx = invokeScript({ ...invokeScriptMinimalParams, fee: 100000 }, stringSeed)
    expect(tx.fee).toEqual(100000)
  })

  it('Should build with zero fee', () => {
    const tx = invokeScript({ ...invokeScriptMinimalParams, fee: 0 }, stringSeed)
    expect(tx.fee).toEqual(0)
  })

  it('Should build with negative fee', () => {
    const tx = invokeScript({ ...invokeScriptMinimalParams, fee: -1 }, stringSeed)
    expect(tx.fee).toEqual(-1)
  })

  it('Should build with test set params', () => {
    const tx = invokeScript(testInvokeScriptParams, stringSeed)
    expect(tx.call!.args[0].value).toEqual('base64:AQa3b8tH')
    expect(tx.call!.args[1].value).toEqual(true)
    expect(tx.call!.args[2].value).toEqual(1234567890)
    expect(tx.call!.args[3].value).toEqual("Abra Shvabra Kadabra")
    //@ts-ignore
    expect(tx.call!.args[4].value[0].value).toEqual('base64:UmlkZQ==')
    //@ts-ignore
    expect(tx.call!.args[4].value[1].value).toEqual(false)
    //@ts-ignore
    expect(tx.call!.args[4].value[2].value).toEqual(223322)
    //@ts-ignore
    expect(tx.call!.args[4].value[3].value).toEqual("Porto Franko")

  })
});

describe('serialize/deserialize cancel lease tx', () => {

  Object.entries(invokeScriptTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        const tx = deleteProofsAndId(Json);
        const protoBytes = txToProtoBytes(tx);
        const parsed = protoBytesToTx(protoBytes);
        expect(parsed).toMatchObject(tx);

        const actualBytes = base16Encode(protoBytes);
        const expectedBytes = base16Encode(base64Decode(Bytes));
        expect(expectedBytes).toBe(actualBytes)

      }))

});
