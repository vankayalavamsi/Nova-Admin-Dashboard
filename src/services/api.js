import {
  products, orders, users,
  revenueSeries, trafficSources, weekdaySessions, categoryShare,
} from '../data/mockData'

const delay = (ms = 450) => new Promise((res) => setTimeout(res, ms))
const clone = (x) => JSON.parse(JSON.stringify(x))

export const api = {
  async getProducts() { await delay(); return clone(products) },
  async getOrders() { await delay(); return clone(orders) },
  async getUsers() { await delay(); return clone(users) },
  async getAnalytics() {
    await delay()
    return clone({ revenueSeries, trafficSources, weekdaySessions, categoryShare })
  },
}