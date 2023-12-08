import Order from './order'
import OrderItem from './order_item'

describe('Order unit tests', () => {
  it('should throw error when id is empty', () => {
    expect(() => {
      let order = new Order('', '123', [])
    }).toThrow('Id is required')
  })
  it('should throw error when customerId is empty', () => {
    expect(() => {
      let order = new Order('123', '', [])
    }).toThrow('CustomerId is required')
  })
  it('should throw error when items is empty', () => {
    expect(() => {
      let order = new Order('123', '123', [])
    }).toThrow('Items are required')
  })
  it('should calculate total', () => {
    const item1 = new OrderItem('i1', 'item1', 100, 'p1', 1)
    const order1 = new Order('o1', '1', [item1])

    expect(order1.total()).toBe(100)

    const item2 = new OrderItem('i2', 'item2', 200, 'p2', 1)
    const order2 = new Order('o2', '2', [item1, item2])

    expect(order2.total()).toBe(300)
  })
  it('should throw error if the item qte is less or equal zero 0', () => {
    expect(() => {
      const item = new OrderItem('i1', 'Item 1', 100, 'p1', 0)
      const order = new Order('o1', 'c1', [item])
    }).toThrow('Quantity must be greater than 0')
  })
})
