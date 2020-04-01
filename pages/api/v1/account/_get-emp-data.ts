import { EmpDataFiltered, EmployeesWithStoreLocations } from '@Types/employees'

//todo - do not have to do this, have privilige system in place so i can sleep tight
// right now:
// return it diligently since fields unchecked in db for auth access rights
export const getEmpData = (
  employee: EmployeesWithStoreLocations
): EmpDataFiltered => {
  const { password, userSigningSecret, ...empDataFiltered } = employee

  return {
    ...empDataFiltered,
  }
}
