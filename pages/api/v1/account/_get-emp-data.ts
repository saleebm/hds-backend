import { Employee, Location as StoreLocation } from '@prisma/client'

//todo - do not have to do this, have privilige system in place so i can sleep tight
// right now:
// return it diligently since fields unchecked in db for auth access rights
export const getEmpData = (
  employee: Employee & { locationId?: StoreLocation }
) => ({
  firstName: employee.firstName,
  lastName: employee.lastName,
  userId: employee.id,
  address: employee.address,
  city: employee.city,
  state: employee.state,
  zip: employee.zip,
  role: employee.role,
  email: employee.email,
  phone: employee.phone,
  ...('locationId' in employee && employee.locationId
    ? { locationId: employee.locationId }
    : {}),
})
