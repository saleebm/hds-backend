import { GetServerSideProps } from 'next'
import { DashboardView } from '@Components/Views/dashboard'
import { CustomerSaleForm } from '@Components/Forms'
import { ProductWithInventory } from '@Pages/dashboard/products'
import mutator from '@Lib/server/mutator'
import { FindOneEmployee } from '@Pages/api/v1/employees'
import { ServerSideProps } from '@Types'
import { StoreLocationsIdOptions } from '@Types/store-locations'
import getApiHostUrl from '@Lib/server/get-api-host'

interface PointOfSaleStaticProps {
  products: string
  currentEmployee: FindOneEmployee
  storeLocationIdOptions: StoreLocationsIdOptions
}

function PointOfSale({
  products,
  currentEmployee,
  storeLocationIdOptions,
}: PointOfSaleStaticProps) {
  // product data is for the transaction form
  const productData: ReadonlyArray<ProductWithInventory> = JSON.parse(products)
  return (
    <DashboardView pageTitle={'Point of Sale'}>
      <CustomerSaleForm
        products={productData}
        currentEmployee={currentEmployee}
        storeLocationIdOptions={storeLocationIdOptions}
      />
    </DashboardView>
  )
}

export const getServerSideProps: GetServerSideProps<PointOfSaleStaticProps> = async (
  ctx: ServerSideProps
) => {
  // get products here to pass down to the form
  const { PrismaClient } = await import('@prisma/client')
  const prismaClient = new PrismaClient()

  const productData = await prismaClient.product.findMany({
    include: { inventory: { include: { storeLocations: true } } },
  })
  const currentUrl = getApiHostUrl(ctx.req)
  const currentEmployee = await mutator<FindOneEmployee>(
    `${currentUrl}/api/v1/employees`,
    {},
    ctx
  )
  //these are the options for looking up other store quantities in stock
  const storeLocationIdOptions = await prismaClient.storeLocations.findMany({
    select: { idStoreLocations: true, city: true },
  })
  return {
    props: {
      products: JSON.stringify(productData),
      currentEmployee,
      storeLocationIdOptions,
    },
  }
}

export default PointOfSale
