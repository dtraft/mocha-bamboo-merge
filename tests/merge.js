const { merge } = require('../lib')
const path = require('path')

describe('merge', () => {
  test('merges configs', async () => {
    const report = await merge({
      reportDir: path.resolve(__dirname, './mocha-bamboo-report'),
    })

    expect(report.stats).toMatchSnapshot({
      start: expect.any(String),
      end: expect.any(String),
    })

    expect(report.failures.length).toBe(3)
    expect(report.passes.length).toBe(3)
    expect(report.skipped.length).toBe(0)
  })

  test('throws when invalid directory provided', async () => {
    const dirname = './invalid-directory'
    const dir = path.resolve(process.cwd(), dirname)
    await expect(merge({ reportDir: dirname })).rejects.toEqual(
      new Error(`Directory ${dir} does not exist`)
    )
  })

  test('defaults to mocha-bamboo-report directory', async () => {
    const dir = path.resolve(process.cwd(), 'mocha-bamboo-report')
    await expect(merge()).rejects.toEqual(
      new Error(`Directory ${dir} does not exist`)
    )
  })
})
