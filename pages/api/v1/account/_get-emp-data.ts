import {
  EmpDataFiltered,
  EmpDataForTable,
  GetEmpDataEmployee,
  GetEmpDataForTableEmployee,
} from '@Types/employees'

//todo - do not have to do this, have privilige system in place so i can sleep tight
// right now:
// return it diligently since fields unchecked in db for auth access rights
export const getEmpData = (employee: GetEmpDataEmployee): EmpDataFiltered => ({
  firstName: employee.firstName,
  lastName: employee.lastName,
  userId: employee.id,
  address: employee.address,
  city: employee.city,
  state: employee.state,
  zip: employee.zip,
  email: employee.email,
  phone: employee.phone,
  ...('locationId' in employee && employee.locationId
    ? { locationId: employee.locationId }
    : {}),
  ...('employeePosition' in employee && employee.employeePosition
    ? { employeePosition: employee.employeePosition }
    : {}),
})

export const getEmpDataForTable = (
  employee: GetEmpDataForTableEmployee
): EmpDataForTable => ({
  userId: employee.id,
  firstName: employee.firstName,
  lastName: employee.lastName,
  address: employee.address,
  city: employee.city,
  state: employee.state,
  zip: employee.zip,
  email: employee.email,
  phone: employee.phone,
  locationId: employee.locationId,
  salary: employee.employeePosition.salary,
  roleCapability: employee.employeePosition.roleCapability,
  positionName: employee.employeePosition.positionName,
})
