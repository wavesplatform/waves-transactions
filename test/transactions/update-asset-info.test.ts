import { publicKey, } from '@waves/ts-lib-crypto'
import {reissue, setScript, sponsorship} from '../../src'
import { validateTxSignature } from '../../test/utils'
import {updateAssetInfoMinimalParams} from "../minimalParams";
import {updateAssetInfo} from "../../src/transactions/update-asset-info";

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
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, assetId}, stringSeed)
        expect(tx).toMatchObject({...updateAssetInfoMinimalParams})
    })

    it('Should create update asset info transaction with minimal name', () => {
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, assetId, name: "yyyy"}, stringSeed)
        expect(tx.name).toEqual("yyyy")
    })

    it('Should create update asset info transaction with extra minimal name', () => {
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, assetId, name: "yyy"}, stringSeed)
        expect(tx.name).toEqual("yyy")
    })

    it('Should create update asset info transaction with maximal name', () => {
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, assetId, name: "aaaaddddmmmmyyyy"}, stringSeed)
        expect(tx.name).toEqual("aaaaddddmmmmyyyy")
    })

    it('Should create update asset info transaction with extra maximal name', () => {
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, assetId, name: "aaaaddddmmmmyyyyz"}, stringSeed)
        expect(tx.name).toEqual("aaaaddddmmmmyyyyz")
    })


    it('Should create update asset info transaction with zero fee', () => {
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, assetId, fee: 0}, stringSeed)
        expect(tx.fee).toEqual(0)
    })

    it('Should create update asset info transaction with negative fee', () => {
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, assetId, fee: -1}, stringSeed)
        expect(tx.fee).toEqual(-1)
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
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, assetId, description: descmax}, stringSeed)
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
        const tx = updateAssetInfo({ ...updateAssetInfoMinimalParams, assetId, description: descmax+"z"}, stringSeed)
        expect(tx.description).toEqual(descmax+"z")
    })

    it('should build from minimal set of params', () => {
        let descmax = ""

        while (descmax.length<1001) {
            let n=Math.random()*(122-65)+65
            let m=Math.round(n)

            if((m<91)||(m>96)) {
                descmax+=String.fromCharCode(m)
            }

        }
        console.log(descmax)
    })
})