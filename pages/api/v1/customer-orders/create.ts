import { handler } from '@Lib/server'
import { CustomerOrder, PrismaClient } from '@prisma/client'
import {
  InvalidArgumentError,
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'
import { parseLocaleNumber } from '@Utils/common'
import { CustomerOrderCreateInputBodyArgs } from '@Types/customer-order'

const prisma = new PrismaClient()

/**
 * post
 * creates customer order
 *
 * @param req.body.customerOrderCreate
 */
export default handler(
  async (req): Promise<{ customerOrder: CustomerOrder }> => {
    if (req.method?.toLowerCase() !== 'post') {
      throw new NotImplementedError()
    }
    // authorized?
    const { userId } = await checkAuth(req.headers)
    if (!userId || isNaN(userId)) {
      // unauthorized
      // no userId from auth headers
      throw new UnauthenticatedError()
    }

    if (!req.body.customerOrderCreate) {
      throw new InvalidArgumentError('Missing customerOrderCreate body arg')
    }

    const {
      customer,
      expectedDeliveryDate,
      storeLocationId,
      orderTotal,
      customerOrderProducts,
    } = req.body.customerOrderCreate as CustomerOrderCreateInputBodyArgs

    //todo type safety
    // make sure idProduct is there since not planning to create
    // also consider doing this inventory management elsewhere ? (not really sure where: but does not feel right here)
    /**
     * The products purchased filtered for inventory management
     *
     */
    const filteredOrderProducts =
      Array.isArray(customerOrderProducts.create) &&
      customerOrderProducts.create.map((orderProduct) => ({
        productId: orderProduct.product.connect?.idProduct,
        quantityPurchased:
          typeof orderProduct.quantity === 'string'
            ? parseInt(orderProduct.quantity)
            : orderProduct.quantity,
        storeLocationIdOfInventory:
          typeof orderProduct.storeLocationIdOfInventory === 'string'
            ? parseInt(orderProduct.storeLocationIdOfInventory)
            : orderProduct.storeLocationIdOfInventory,
      }))

    /**
     * The POS provides employees option to select products from other locations
     * This makes sure we update the correct inventory product
     */
    if (Array.isArray(filteredOrderProducts)) {
      const productInventoryUpdate = []

      for await (const product of filteredOrderProducts) {
        if (
          product.productId &&
          !isNaN(product.productId) &&
          product.storeLocationIdOfInventory
        ) {
          const possibleInventoryItem = await prisma.inventory.findOne({
            where: {
              productId_storeLocation: {
                productId: product.productId,
                storeLocation: product.storeLocationIdOfInventory,
              },
            },
          })
          if (!!possibleInventoryItem && possibleInventoryItem.quantityOnHand) {
            const { quantityOnHand } = possibleInventoryItem
            productInventoryUpdate.push(
              prisma.inventory.update({
                where: {
                  productId_storeLocation: {
                    storeLocation: product.storeLocationIdOfInventory,
                    productId: product.productId,
                  },
                },
                data: {
                  quantityOnHand: quantityOnHand - product.quantityPurchased,
                },
              })
            )
          } // end check of possibleInventoryItem
        } // end check productId && store location exist
      } // end for await loop
      // now Promise.all it like a champ the batch payload
      await Promise.all(productInventoryUpdate)
    }
    try {
      const customerOrder = await prisma.customerOrder.create({
        data: {
          customer: customer,
          expectedDeliveryDate: new Date(expectedDeliveryDate),
          orderTotal:
            typeof orderTotal === 'string'
              ? Number(parseLocaleNumber(orderTotal))
              : orderTotal,
          storeLocations: {
            connect: { idStoreLocations: storeLocationId },
          },
          customerOrderProducts: {
            /* have to do this so no invalid args passed in, ie storeLocationId */
            create: customerOrderProducts.create.map(
              ({ product, quantity, perUnitCost }) => ({
                product,
                quantity,
                perUnitCost,
              })
            ),
          },
        },
      })

      return { customerOrder }
    } catch (e) {
      throw new Error(e)
    }
  }
)
