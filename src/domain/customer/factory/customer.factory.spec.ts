import Address from '../value-object/address'
import CustomerFactory from './customer.factory'

describe('Customer factory unit tests', () => {
  it('should create a customer', () => {
    let customer = CustomerFactory.create('John')

    expect(customer.id).toBeDefined()
    expect(customer.name).toBe('John')
    expect(customer.Address).toBeUndefined()
  })
  it('should create a customer with a address', () => {
    const address = new Address('Street 1', 12, '23456-888', 'City 1')

    let customer = CustomerFactory.createWithAddress('John', address)

    expect(customer.id).toBeDefined()
    expect(customer.name).toBe('John')
    expect(customer.Address).toBe(address)
  })
})
