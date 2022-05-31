import {checkBinarySerializeDeserialize, checkProtoSerializeDeserialize, errorMessageByTemplate} from '../../test/utils'
import {sponsorshipMinimalParams} from "../minimalParams";
import {sponsorship} from "../../src/transactions/sponsorship";
import {sponsorshipTx} from "./expected/proto/sponsorship.tx";
import {sponsorshipBinaryTx} from "./expected/binary/sponsorship.tx";

describe('setSponsorship', () => {

    const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8';

    it('Should create sponsorship transaction', () => {
      const tx = sponsorship({ ...sponsorshipMinimalParams}, stringSeed)
      expect(tx).toMatchObject({...sponsorshipMinimalParams, fee: 100000, chainId: 87})
    });

    it('Should not create sponsorship transaction with zero sponsor fee', () => {
        expect(() => {
            const spTx = sponsorship({ ...sponsorshipMinimalParams, minSponsoredAssetFee: 0 }, stringSeed)
            console.log(spTx)
            return spTx
        })
            .toThrowError(errorMessageByTemplate('minSponsoredAssetFee', 0))
    });

    it('Should create sponsorship transaction with null sponsor fee', () => {
        const tx = sponsorship({ ...sponsorshipMinimalParams, minSponsoredAssetFee: null}, stringSeed)
        expect(tx).toMatchObject({...sponsorshipMinimalParams, minSponsoredAssetFee: null})

 //       expect(() =>sponsorship({ ...sponsorshipMinimalParams, minSponsoredAssetFee: null }, stringSeed))
  //          .toThrowError(errorMessageByTemplate('minSponsoredAssetFee', 0))
    });

    it('Should not create sponsorship transaction with negative sponsor fee', () => {
        expect(() =>sponsorship({ ...sponsorshipMinimalParams, minSponsoredAssetFee: -1 }, stringSeed))
            .toThrowError(errorMessageByTemplate('minSponsoredAssetFee', -1))

    });

    it('Should not create sponsorship transaction empty assetId', () => {
        expect(() =>sponsorship({ ...sponsorshipMinimalParams, assetId: "" }, stringSeed))
            .toThrowError(errorMessageByTemplate('assetId', ""))
    });

    it('Should create sponsorship transaction with zero fee', () => {
        const tx = sponsorship({ ...sponsorshipMinimalParams, fee: 0 }, stringSeed);
        expect(tx.fee).toEqual(0)
    });

    it('Should not create sponsorship transaction with negative fee', () => {
        expect(() =>sponsorship({ ...sponsorshipMinimalParams, fee: -1 }, stringSeed))
             .toThrowError(errorMessageByTemplate('fee', -1))
    })

});

describe('serialize/deserialize sponsorship tx', () => {

    Object.entries(sponsorshipTx).forEach(([name, {Bytes, Json}]) =>
        it(name, () => {
            checkProtoSerializeDeserialize({Json: Json, Bytes: Bytes});
        }))

});

describe('serialize/deserialize sponsorship binary tx', () => {

    Object.entries(sponsorshipBinaryTx).forEach(([name, {Bytes, Json}]) =>
        it(name, () => {
            checkBinarySerializeDeserialize({Json: Json, Bytes: Bytes});
        }))

});
