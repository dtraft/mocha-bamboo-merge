const fse = require('fs-extra')
const minimatch = require('minimatch')
const path = require('path')
const { flatMap } = require('./utils')

function generateStats(stats) {
  return stats.reduce(function(collectedStats, report){
    return {
      suites: collectedStats.suites + report.suites,
      tests: collectedStats.tests + report.tests,
      passes: collectedStats.passes + report.passes,
      pending: collectedStats.pending + report.pending,
      failures: collectedStats.failures + report.failures,
      duration: collectedStats.duration + report.duration,
      start: !collectedStats.start || report.start < collectedStats.start ? report.start : collectedStats.start,
      end: !collectedStats.end || report.end > collectedStats.end ? report.end : collectedStats.end
    }
  }, {
    suites: 0,
    tests: 0,
    passes: 0,
    pending: 0,
    failures: 0,
    duration: 0
  });
}

async function collectReportFiles(dir) {
  const files = await fse.readdir(dir).catch(() => {
    throw new Error(`Directory ${dir} does not exist`)
  })
  return Promise.all(
    files
      .filter(file => minimatch(file, 'mocha*.json'))
      .map(filename => path.resolve(dir, filename))
      .map(filename => fse.readJson(filename))
  )
}

exports.merge = async function merge({
  reportDir = 'mocha-bamboo-report',
} = {}) {
  const dir = path.resolve(process.cwd(), reportDir)
  const reports = await collectReportFiles(dir)
  const allStats = reports.map(r => r.stats)

  return {
    stats: generateStats(allStats),
    failures: flatMap(r => r.failures)(reports),
    passes: flatMap(r => r.passes)(reports),
    skipped: flatMap(r => r.skipped)(reports),
  }
}
