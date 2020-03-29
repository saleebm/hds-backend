import { DashboardView } from '@Components/Views/dashboard'
import { GetServerSideProps } from 'next'
import { Product } from '@prisma/client'
import { ProductsTable } from '@Components/Entities/Products'

export interface Products {
  products: ReadonlyArray<Product> | string
}
function ProductsPage({ products }: Products) {
  return (
    <DashboardView pageTitle={'Products'}>
      <ProductsTable products={JSON.parse(products.toString())} />
    </DashboardView>
  )
}

export const getServerSideProps: GetServerSideProps<Products> = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prismaClient = new PrismaClient()
  const productData = await prismaClient.product.findMany()
  return {
    props: {
      products: JSON.stringify(productData),
    },
  }
}

export default ProductsPage
