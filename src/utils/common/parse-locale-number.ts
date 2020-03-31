export function parseLocaleNumber(stringNumber: string) {
  let num = 10123456789.789,
    fmt_local = Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
    parts_local = fmt_local.formatToParts(num),
    group = '',
    decimal = '',
    currency = ''

  // separators
  parts_local.forEach(function (i) {
    //console.log(i.type + ':' + i.value);
    switch (i.type) {
      case 'group':
        group = i.value
        break
      case 'decimal':
        decimal = i.value
        break
      case 'currency':
        currency = i.value
        break
      default:
        break
    }
  })

  return parseFloat(
    stringNumber
      .replace(new RegExp('\\' + group, 'g'), '')
      .replace(new RegExp('\\' + decimal), '.')
      .replace(new RegExp('\\' + currency, 'g'), '')
  )
}
