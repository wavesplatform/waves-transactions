import { run } from './utils'

async function keepVersions(versionsToKeep: string[]) {
  const response = await run('npm view waves-transactions')
  const versionInfo = eval('(' + response + ')')
  const versionsToRemove = versionInfo.versions.filter((x:any) => !versionsToKeep.includes(x))
  await Promise.all(versionsToRemove.map((v:any) => run('npm unpublish waves-transactions@' + v).then(_ => console.log(v + ' removed')).catch(_ => { })))
  console.log('done')
}

keepVersions(['1.0.21',
  '1.0.20',
  '1.0.14',
  '1.0.7'])