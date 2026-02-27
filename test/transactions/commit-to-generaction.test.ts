import {commitToGeneraction} from '../../src'
import {checkProtoSerializeDeserialize, validateTxSignature} from '../utils'
import {cgt} from './expected/proto/commit-to-generation.tx'

describe('commitToGeneraction', () => {
    const privateKey = {privateKey: 'YkoCJDT4eLtCv5ynNAc4gmZo8ELM9bEbBXsEtGTWrCc'}

    it('should build from minimal set of params', () => {
        const tx = commitToGeneraction({generationPeriodStart: 2941}, privateKey)
        expect(tx).toMatchObject({generationPeriodStart: 2941, fee: 10000000, chainId: 87, version: 1})
        expect(tx.endorserPublicKey).toBeTruthy()
        expect(tx.commitmentSignature).toBeTruthy()
    })

    it('Should get correct signature', () => {
        const tx = commitToGeneraction({generationPeriodStart: 2941}, privateKey)
        expect(validateTxSignature(tx, 0)).toBeTruthy()
    })
})

describe('serialize/deserialize commit to generation tx', () => {
    Object.entries(cgt).forEach(([name, {Bytes, Json}]) =>
        it(name, () => {
            checkProtoSerializeDeserialize({Json: Json, Bytes: Bytes})
        }))
})
