import {checkProtoSerializeDeserialize, errorMessageByTemplate, rndString} from '../utils'
import {updateAssetInfoMinimalParams} from "../minimalParams";
import {updateAssetInfoTx} from "./expected/proto/update-asset-info.tx";
import {updateAssetInfo} from "../../src";

describe('updateAssetInfo', () => {

    const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8';

    it('Should create update asset info transaction', () => {
        const tx = updateAssetInfo({...updateAssetInfoMinimalParams}, stringSeed);
        expect(tx).toMatchObject({...updateAssetInfoMinimalParams})
    });

    it('Should create update asset info transaction with extra minimal name', () => {
        expect(() => updateAssetInfo({...updateAssetInfoMinimalParams, name: "yyy"}, stringSeed))
            .toThrowError(errorMessageByTemplate('name', 'yyy'))
    });

    it('Should create update asset info transaction with maximal name', () => {
        const tx = updateAssetInfo({...updateAssetInfoMinimalParams, name: "this_is_16_bytes"}, stringSeed);
        expect(tx.name).toEqual("this_is_16_bytes")
    });

    it('Should create update asset info transaction with extra maximal name', () => {
        expect(() => updateAssetInfo({...updateAssetInfoMinimalParams, name: "this_is_17_bytes_"}, stringSeed))
            .toThrowError(errorMessageByTemplate('name', 'this_is_17_bytes_'))
    });

    it('Should create update asset info transaction with zero fee', () => {
        const tx = updateAssetInfo({...updateAssetInfoMinimalParams, fee: 0}, stringSeed);
        expect(tx.fee).toEqual(0)
    });

    it('Should not create update asset info transaction with negative fee', () => {
        expect(() => updateAssetInfo({...updateAssetInfoMinimalParams, fee: -1}, stringSeed))
            .toThrowError(errorMessageByTemplate('fee', -1))
    });

    it('Should create update asset info transaction with minimal fee', () => {
        const tx = updateAssetInfo({...updateAssetInfoMinimalParams}, stringSeed);
        expect(tx.fee).toEqual(100000)
    });

    it('Should create update asset info transaction with max description', () => {
        const descr = rndString(1000) + "z";
        const tx = updateAssetInfo({...updateAssetInfoMinimalParams, description: descr}, stringSeed);
        expect(tx.description).toEqual(descr);
    });

    it('Should not create update asset info transaction with description lenght > 1000', () => {
        const descr = rndString(1000) + "z";

        expect(() => updateAssetInfo({...updateAssetInfoMinimalParams, description: descr}, stringSeed))
            .toThrowError(errorMessageByTemplate('description', descr))
    })

});

describe('serialize/deserialize update asset info tx', () => {

    Object.entries(updateAssetInfoTx).forEach(([name, {Bytes, Json}]) =>
        it(name, () => {
            checkProtoSerializeDeserialize({Json: Json, Bytes: Bytes});
        }))

});
