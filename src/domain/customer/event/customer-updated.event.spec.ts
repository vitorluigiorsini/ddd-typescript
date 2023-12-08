import Address from '../value-object/address'
import Customer from '../entity/customer'
import EventDispatcher from '../../@shared/event/event-dispatcher'
import CustomerUpdatedEvent from './customer-updated.event'
import SendFirstLogWhenCustomerIsUpdatedHandler from './handler/send-first-log-when-customer-is-updated.handler'

describe('Customer events tests', () => {
  it('should notify all customer event handlers when customer is updated', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendFirstLogWhenCustomerIsUpdatedHandler()
    const spyEventHandler = jest.spyOn(eventHandler, 'handle')

    eventDispatcher.register('CustomerUpdatedEvent', eventHandler)

    expect(eventDispatcher.getEventHandlers['CustomerUpdatedEvent'][0]).toMatchObject(eventHandler)

    const customer = new Customer('c1', 'Customer 1')
    const address = new Address('Street 1', 1, '11111-111', 'Ouro Branco')

    customer.changeAddress(address)

    const customerCreatedEvent = new CustomerUpdatedEvent({
      id: customer.id,
      name: customer.name,
      address: customer.Address
    })

    eventDispatcher.notify(customerCreatedEvent)

    expect(spyEventHandler).toHaveBeenCalled()
  })
})
