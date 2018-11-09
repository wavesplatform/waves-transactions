import { alias } from '../src';

export const aliasMinimalParams = {
  alias: 'MyTestAlias'
}

describe('alias', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = alias({ ...aliasMinimalParams }, stringSeed)
    expect(tx).toMatchObject({ ...aliasMinimalParams })
  })

})