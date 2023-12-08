import Customer from '../entity/customer'
import EventDispatcher from '../../@shared/event/event-dispatcher'
import CustomerCreatedEvent from './customer-created.event'
import SendFirstLogWhenCustomerIsCreatedHandler from './handler/send-first-log-when-customer-is-created.handler'
import SendSecondtLogWhenCustomerIsCreatedHandler from './handler/send-second-log-when-customer-is-created.handler'

describe('Customer events tests', () => {
  it('should notify all customer event handlers when customer is created', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler1 = new SendFirstLogWhenCustomerIsCreatedHandler()
    const eventHandler2 = new SendSecondtLogWhenCustomerIsCreatedHandler()
    const spyEventHandler1 = jest.spyOn(eventHandler1, 'handle')
    const spyEventHandler2 = jest.spyOn(eventHandler2, 'handle')

    eventDispatcher.register('CustomerCreatedEvent', eventHandler1)
    eventDispatcher.register('CustomerCreatedEvent', eventHandler2)

    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandler1)
    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][1]).toMatchObject(eventHandler2)

    const customer = new Customer('c1', 'Customer 1')

    const customerCreatedEvent = new CustomerCreatedEvent(customer)

    eventDispatcher.notify(customerCreatedEvent)

    expect(spyEventHandler1).toHaveBeenCalled()
    expect(spyEventHandler2).toHaveBeenCalled()
  })
})
