import { GetServerSideProps } from 'next'
import { DashboardView } from '@Components/Views/dashboard'
import { CustomerSaleForm } from '@Components/Forms'
import { ProductWithInventory } from '@Pages/dashboard/products'

interface PointOfSaleStaticProps {
  products: string
}

function PointOfSale({ products }: PointOfSaleStaticProps) {
  // product data is for the transaction form
  const productData: ReadonlyArray<ProductWithInventory> = JSON.parse(products)
  return (
    <DashboardView pageTitle={'Point of Sale'}>
      <CustomerSaleForm products={productData} />
    </DashboardView>
  )
}

export const getServerSideProps: GetServerSideProps<PointOfSaleStaticProps> = async () => {
  // todo get products here to pass down to the form
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

export default PointOfSale
