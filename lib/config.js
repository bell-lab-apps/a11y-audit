const fs = require('fs')
const url = require('url')
const path = require('path')

module.exports = async options => {
  // Valid Formats
  const validFormats = ['cli', 'csv', 'html', 'json', 'markdown', 'md', 'tsv', 'xml']

  // Valid Test Standards
  const validStandards = ['Section508', 'WCAG2A', 'WCAG2AA', 'WCAG2AAA']

  // Check if we are trying to load a config file
  const configFile = options.config ? options.config : null

  // Keep track of any errors that might happen
  let error

  // Set Default Pa11y Configuration
  let config = {
    format: 'cli',
    includeNotices: true,
    includeWarnings: true,
    output: process ? process.cwd() : null,
    standard: 'WCAG2AA',
    userAgent: 'Bell Apps - Accessibility Audit',
    wait: 0
  }

  // Check if we have a Config file to load and combine it with the CLI params
  if (configFile && fs.existsSync(configFile)) {
    const localConfig = fs.readFileSync(configFile, 'utf8')

    if (localConfig) {
      try {
        const opts = JSON.parse(localConfig)

        if (typeof opts === 'object') {
          // Update config with loaded settings
          options = Object.assign(options, opts)

          if (options.tests && Array.isArray(options.tests)) {
            config.tests = options.tests
          }
        }
      } catch (err) {
        error = `Unable to Load: ${configFile}`
      }
    }
  }

  // Check if we are passing in params via CLI and update config
  if (options.debug && typeof options.debug === 'boolean') {
    config.debug = options.debug
  }

  if (options.format && validFormats.indexOf(options.format) !== -1) {
    config.format = options.format
  }

  if (options.format && validFormats.indexOf(options.format) !== -1) {
    config.format = options.format
  }

  if (options.ignore && Array.isArray(options.ignore)) {
    config.ignore = options.ignore
  }

  if (typeof options.notices === 'boolean') {
    config.includeNotices = options.notices
  }

  if (options.output) {
    config.output = options.output
  }

  if (typeof options.screenCapture === 'boolean') {
    config.screenCapture = options.screenCapture
  }

  if (options.standard && validStandards.indexOf(options.standard) !== -1) {
    config.standard = options.standard
  }

  if (typeof options.timeout === 'number') {
    config.timeout = options.timeout
  }

  if (typeof options.wait === 'number') {
    config.wait = options.wait
  }

  if (typeof options.warnings === 'boolean') {
    config.includeWarnings = options.warnings
  }

  // Map any arguments passed via CLI that were not flags and check if there are URLs to test
  if (options['_'] && options['_'].length > 0) {
    // Initialize tests if not already present
    if (!config.tests) {
      config.tests = []
    }

    // If passed param is a website, let's make a test out of it
    options['_'].forEach(arg => {
      if (arg.startsWith('http://') || arg.startsWith('https://')) {
        let website = url.parse(arg, true)

        config.tests.push({
          label: website.host,
          url: arg
        })
      }
    })
  }

  // Sanity check that output directory exists
  if (fs.existsSync(config.output)) {
    config.output = path.resolve(config.output)
  } else {
    error = `Invalid Output Directory: ${config.output}`
  }

  // Update Markdown to md if set since it's just an alias
  if (config.format === 'markdown') {
    config.format = 'md'
  }

  return new Promise((resolve, reject) => {
    if (error) {
      return reject(error)
    }

    return resolve(config)
  })
}