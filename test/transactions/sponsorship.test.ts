import {checkProtoSerializeDeserialize, errorMessageByTemplate} from '../../test/utils'
import {sponsorshipMinimalParams} from "../minimalParams";
import {sponsorship} from "../../src/transactions/sponsorship";
import {sponsorshipTx} from "./expected/proto/sponsorship.tx";

describe('setSponsorship', () => {

    const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8';

    it('Should create sponsorship transaction', () => {
      const tx = sponsorship({ ...sponsorshipMinimalParams}, stringSeed)
      expect(tx).toMatchObject({...sponsorshipMinimalParams})
    });


    it('Should create sponsorship transaction with zero sponsor fee', () => {
        expect(() =>sponsorship({ ...sponsorshipMinimalParams, minSponsoredAssetFee: 0 }, stringSeed))
            .toThrowError(errorMessageByTemplate('minSponsoredAssetFee', 0))
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
