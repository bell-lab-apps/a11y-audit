'use strict'

const report = (module.exports = {})

// Supported Versions
report.supports = '^5.0.0 || ^5.0.0-alpha || ^5.0.0-beta'

// Output formatted results
report.results = testResults => {
  const types = {
    error: '✖',
    notice: '◆',
    unknown: '›',
    warning: '▲'
  }

  let output = []

  output.push('h1. A11Y Report Summary')
  output.push(`*Date:* ${testResults.generated.date}`)

  output.push(`h3. Total Issues: ${parseInt(testResults.total.all)}`)
  output.push(`✖ Errors: ${parseInt(testResults.total.error)} ▲ Warnings: ${parseInt(testResults.total.warning)} ◆ Notices: ${parseInt(testResults.total.notice)}`)

  // Loop through reports
  testResults.results.forEach(result => {
    output.push('\\\\')
    output.push('----')
    output.push('\\\\')

    output.push(`h2. ⚑ ${result.documentTitle}`)
    output.push(`*URL:* [${result.pageUrl}|${result.pageUrl}]`)

    if (result.screenCapture) {
      output.push('\n')
      output.push(`!${result.screenCapture.replace(/^.*[\\\/]/, '')}|thumbnail!`) // eslint-disable-line no-useless-escape
      output.push('\n')
    }

    if (result.total.all === 0) {
      output.push('No Accessibility Issues Detected')
      output.push('\\\\')
    } else {
      output.push(`h3. Test Issues (${result.total.all})`)

      let group
      let counter = 0

      for (let i = 0; i < result.issues.length; i++) {
        const issue = result.issues[i]

        const selector = issue.selector ? '{code:css}' + issue.selector + '{code}' : null
        const context = issue.context ? '{code:html}' + issue.context + '{code}' : null
        const type = issue.type.charAt(0).toUpperCase() + issue.type.slice(1)

        let row = []

        // Group Reports By Type
        if (!group || group !== issue.type) {
          if (group) {
            row.push('</details>')
          }

          if (group !== issue.type) {
            group = issue.type
            counter = 0
          }

          row.push(`{panel:title=${type}s: ${result.total[issue.type]}|collapse=true}\n`)
        }

        counter++

        row.push(`||#${counter}||${types[issue.type]} ${type}: ${issue.code}||`, `|*Issue*|${issue.message}|`)

        if (issue.recommendation) {
          row.push(`|*Fix*|${issue.recommendation}|`)
        }

        if (issue.context) {
          row.push(`|*Context*|${context}|`)
        }

        if (issue.selector) {
          row.push(`|*Selector*|${selector}|`)
        }

        if (issue.resources) {
          let links = []

          issue.resources.forEach(link => {
            links.push(`[${link.type} ${link.label}|${link.url}]`)
          })

          row.push(`|*Resources*|${links.join(', ')}|`)
        }

        output.push(row.join('\n'))
      }

      output.push('{panel}')
    }
  })

  output.push('----')

  output.push(`*Report Generated by:* [Bell Lab - A11y Audit|https://github.com/bell-lab-apps/a11y-audit]`)

  return output.join('\n')
}

// Output error messages
report.error = message => {
  return message
}