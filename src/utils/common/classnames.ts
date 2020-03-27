// from Shopify/polaris-react
type Falsy = boolean | undefined | null | 0

export default (...classes: (string | Falsy)[]) =>
  classes.filter(Boolean).join(' ')
