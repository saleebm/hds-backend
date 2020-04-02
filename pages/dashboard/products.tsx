import { DashboardView } from '@Components/Views/dashboard'
import { GetServerSideProps } from 'next'
import { FindManyInventoryArgs, ProductGetPayload } from '@prisma/client'
import { ProductsTable } from '@Components/Entities/Products'

export type ProductWithInventory = ProductGetPayload<{
  include: { inventory: FindManyInventoryArgs }
}>

export interface Products {
  products: ReadonlyArray<ProductWithInventory>
}

export interface ProductsServerSideProps {
  products: ReadonlyArray<ProductWithInventory> | string
}

function ProductsPage({ products }: ProductsServerSideProps) {
  return (
    <DashboardView pageTitle={'Products'}>
      <ProductsTable products={JSON.parse(products.toString())} />
    </DashboardView>
  )
}

export const getServerSideProps: GetServerSideProps<ProductsServerSideProps> = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prismaClient = new PrismaClient()
  const productData = await prismaClient.product.findMany({
    include: { inventory: { include: { storeLocations: true } } },
  })
  return {
    props: {
      products: JSON.stringify(productData),
    },
  }
}

export default ProductsPage
