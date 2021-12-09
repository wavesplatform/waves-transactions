import {checkSerializeDeserialize, deleteProofsAndId, validateTxSignature} from '../../test/utils'
import {transferMinimalParams, updateAssetInfoMinimalParams} from "../minimalParams";
import {updateAssetInfo} from "../../src/transactions/update-asset-info";
import {updateAssetInfoTx} from "./expected/update-asset-info.tx";
import {transfer} from "../../src";

describe('updateAssetInfo', () => {

    const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

    const assetId = "syXBywr2HVY7wxqkaci1jKY73KMpoLh46cp1peJAZNJ"

    let descmax = ""

    while (descmax.length<1000) {
        let n=Math.random()*(122-65)+65
        let m=Math.round(n)

        if((m<91)||(m>96)) {
            descmax+=String.fromCharCode(m)
        }

    }

    it('Should create update asset info transaction', () => {
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams}, stringSeed)
        expect(tx).toMatchObject({...updateAssetInfoMinimalParams})
    })

    it('Should create update asset info transaction with minimal name', () => {
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, name: "yyyy"}, stringSeed)
        expect(tx.name).toEqual("yyyy")
    })

    it('Should create update asset info transaction with extra minimal name', () => {
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, name: "yyy"}, stringSeed)
        expect(tx.name).toEqual("yyy")
    })

    it('Should create update asset info transaction with maximal name', () => {
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, name: "aaaaddddmmmmyyyy"}, stringSeed)
        expect(tx.name).toEqual("aaaaddddmmmmyyyy")
    })

    it('Should create update asset info transaction with extra maximal name', () => {
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, name: "aaaaddddmmmmyyyyz"}, stringSeed)
        expect(tx.name).toEqual("aaaaddddmmmmyyyyz")
    })


    it('Should create update asset info transaction with zero fee', () => {
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, fee: 0}, stringSeed)
        expect(tx.fee).toEqual(0)
    })

    it('Should not create update asset info transaction with negative fee', () => {
        expect(() =>updateAssetInfo({ ...updateAssetInfoMinimalParams, fee: -1}, stringSeed))
            .toThrowError('tx "fee", has wrong data: "-1". Check tx data.')
        //const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, fee: -1}, stringSeed)
        //expect(tx.fee).toEqual(-1)
    })

    it('Should create update asset info transaction with minimal fee', () => {
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams}, stringSeed)
        expect(tx.fee).toEqual(100000)
    })

    it('Should create update asset info transaction with maximal description', () => {
        let descmax = ""

        while (descmax.length<100) {
            let n=Math.random()*(122-65)+65
            let m=Math.round(n)

            if((m<91)||(m>96)) {
                descmax+=String.fromCharCode(m)
            }

        }
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, description: descmax}, stringSeed)
        expect(tx.description).toEqual(descmax)
        console.log(tx.description)

    })

    it('Should create update asset info transaction with extra maximal description', () => {
        while (descmax.length<1000) {
            let n=Math.random()*(122-65)+65
            let m=Math.round(n)

            if((m<91)||(m>96)) {
                descmax+=String.fromCharCode(m)
            }

        }
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, description: descmax+"z"}, stringSeed)
        expect(tx.description).toEqual(descmax+"z")
    })

});

describe('serialize/deserialize update asset info tx', () => {

    Object.entries(updateAssetInfoTx).forEach(([name, {Bytes, Json}]) =>
        it(name, () => {
            checkSerializeDeserialize({Json: Json, Bytes: Bytes});
        }))

});