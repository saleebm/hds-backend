# Products

---

1. to get all products. necessary for front end
   - hit /api/v1/products/all
2. Thank you Prisma for creating these sweet type definitions:

```typescript
// generated to @prisma/client with prisma generate
type Enumerable<T> = T | Array<T>
// partial because I removed some that are not necessary for the team project
type ProductSelect = Partial<{
  brand?: boolean
  createdAt?: boolean
  deliveryPrice?: boolean
  description?: boolean
  idProduct?: boolean
  listPrice?: boolean
  modelNumber?: boolean
  productCategory?: boolean
  salePrice?: boolean
  serialNumber?: boolean
  unitPrice?: boolean
  updatedAt?: boolean
}>
type StringFilter = {
  equals?: string | null
  not?: string | StringFilter | null
  in?: Enumerable<string> | null
  notIn?: Enumerable<string> | null
  lt?: string | null
  lte?: string | null
  gt?: string | null
  gte?: string | null
  contains?: string | null
  startsWith?: string | null
  endsWith?: string | null
}

export type ProductWhereInput = {
  brand?: string | StringFilter | null
  createdAt?: Date | string | null
  deliveryPrice?: number | null
  description?: string | null
  idProduct?: number | null
  listPrice?: number | null
  modelNumber?: string | StringFilter | null
  productCategory?: string | StringFilter | null
  salePrice?: number | null
  serialNumber?: string | StringFilter | null
  unitPrice?: number | null
  updatedAt?: Date | string | null
  AND?: Enumerable<ProductWhereInput> | null
  OR?: Enumerable<ProductWhereInput> | null
  NOT?: Enumerable<ProductWhereInput> | null
}
export declare const OrderByArg: {
  asc: 'asc'
  desc: 'desc'
}

export declare type OrderByArg = typeof OrderByArg[keyof typeof OrderByArg]
export type ProductOrderByInput = {
  brand?: OrderByArg | null
  createdAt?: OrderByArg | null
  deliveryPrice?: OrderByArg | null
  description?: OrderByArg | null
  idProduct?: OrderByArg | null
  listPrice?: OrderByArg | null
  modelNumber?: OrderByArg | null
  productCategory?: OrderByArg | null
  salePrice?: OrderByArg | null
  serialNumber?: OrderByArg | null
  unitPrice?: OrderByArg | null
  updatedAt?: OrderByArg | null
}
 type ProductWhereUniqueInput = {
  idProduct?: number | null
  serialNumber?: string | null
}
/**
 * Product findMany
 */
export type FindManyProductArgs = {
  /**
   * Select specific fields to fetch from the Product
   **/
  select?: ProductSelect | null
  /**
   * Choose, which related nodes to fetch as well.
   **/
  // not necessary for this implementation
  // include?: ProductInclude | null
  /**
   * Filter, which Products to fetch.
   **/
  where?: ProductWhereInput | null
  /**
   * Determine the order of the Products to fetch.
   **/
  orderBy?: ProductOrderByInput | null
  /**
   * Skip the first `n` Products.
   **/
  skip?: number | null
  /**
   * Get all Products that come after the Product you provide with the current order.
   **/
  after?: ProductWhereUniqueInput | null
  /**
   * Get all Products that come before the Product you provide with the current order.
   **/
  before?: ProductWhereUniqueInput | null
  /**
   * Get the first `n` Products.
   **/
  first?: number | null
  /**
   * Get the last `n` Products.
   **/
  last?: number | null
}
```
