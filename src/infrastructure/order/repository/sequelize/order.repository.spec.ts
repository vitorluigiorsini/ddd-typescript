import { Sequelize } from 'sequelize-typescript'
import Customer from '../../../../domain/customer/entity/customer'
import Address from '../../../../domain/customer/value-object/address'
import Product from '../../../../domain/product/entity/product'
import OrderItem from '../../../../domain/checkout/entity/order_item'
import Order from '../../../../domain/checkout/entity/order'
import CustomerModel from '../../../customer/sequelize/customer.model'
import CustomerRepository from '../../../customer/sequelize/customer.repository'
import ProductModel from '../../../product/sequelize/product.model'
import ProductRepository from '../../../product/sequelize/product.repository'
import OrderItemModel from './order-item.model'
import OrderModel from './order.model'
import OrderRepository from './order.repository'

describe('Order repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    await sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a new order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('c1', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('p1', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem('oi1', product.name, product.price, product.id, 2)

    const order = new Order('o1', 'c1', [orderItem])

    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items']
    })

    expect(orderModel.toJSON()).toStrictEqual({
      id: 'o1',
      customer_id: 'c1',
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: 'o1',
          product_id: 'p1'
        }
      ]
    })
  })

  it('should update an order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('c1', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('p1', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem('oi1', product.name, product.price, product.id, 2)

    const order = new Order('o1', 'c1', [orderItem])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const product2 = new Product('p2', 'Product 2', 20)
    await productRepository.create(product2)

    const orderItem2 = new OrderItem('oi2', product2.name, product2.price, product2.id, 4)

    order.items.push(orderItem2)
    await orderRepository.update(order)

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items']
    })

    expect(orderModel.toJSON()).toStrictEqual({
      id: 'o1',
      customer_id: 'c1',
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: 'o1',
          product_id: 'p1'
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: 'o1',
          product_id: 'p2'
        }
      ]
    })
  })

  it('should find an order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('c1', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('p1', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem('oi1', product.name, product.price, product.id, 2)

    const orderRepository = new OrderRepository()
    const order = new Order('o1', 'c1', [orderItem])
    await orderRepository.create(order)

    const foundOrder = await orderRepository.find(order.id)

    expect(foundOrder).toStrictEqual(order)
  })

  it('should find all orders', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('c1', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('p1', 'Product 1', 10)
    const product2 = new Product('p2', 'Product 2', 20)
    await productRepository.create(product)
    await productRepository.create(product2)

    const orderItem = new OrderItem('oi1', product.name, product.price, product.id, 2)
    const orderItem2 = new OrderItem('oi2', product2.name, product2.price, product2.id, 4)

    const orderRepository = new OrderRepository()
    const order = new Order('o1', 'c1', [orderItem])
    const order2 = new Order('o2', 'c1', [orderItem2])
    await orderRepository.create(order)
    await orderRepository.create(order2)

    const orders = [order, order2]

    const foundOrders = await orderRepository.findAll()

    expect(foundOrders).toStrictEqual(orders)
  })
})
