export const categories = ['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Beauty']

export const products = [
  { id: 'PRD-1001', name: 'Aurora Wireless Headphones', category: 'Electronics', price: 12999, stock: 42, sold: 1243, rating: 4.7, status: 'active' },
  { id: 'PRD-1002', name: 'Nimbus Smart Watch S2', category: 'Electronics', price: 19999, stock: 8, sold: 987, rating: 4.5, status: 'active' },
  { id: 'PRD-1003', name: 'Terra Canvas Backpack', category: 'Fashion', price: 2499, stock: 120, sold: 754, rating: 4.6, status: 'active' },
  { id: 'PRD-1004', name: 'Lumen Desk Lamp Pro', category: 'Home & Living', price: 1899, stock: 0, sold: 431, rating: 4.3, status: 'draft' },
  { id: 'PRD-1005', name: 'Velocity Running Shoes', category: 'Sports', price: 4999, stock: 64, sold: 1102, rating: 4.8, status: 'active' },
  { id: 'PRD-1006', name: 'Drift Linen Shirt', category: 'Fashion', price: 1499, stock: 210, sold: 389, rating: 4.2, status: 'active' },
  { id: 'PRD-1007', name: 'Pulse Fitness Tracker', category: 'Sports', price: 3499, stock: 5, sold: 656, rating: 4.4, status: 'active' },
  { id: 'PRD-1008', name: 'Halo Skincare Set', category: 'Beauty', price: 2199, stock: 88, sold: 923, rating: 4.9, status: 'active' },
  { id: 'PRD-1009', name: 'Ember Ceramic Mug Set', category: 'Home & Living', price: 899, stock: 143, sold: 267, rating: 4.1, status: 'active' },
  { id: 'PRD-1010', name: 'Orbit Bluetooth Speaker', category: 'Electronics', price: 5499, stock: 37, sold: 845, rating: 4.5, status: 'active' },
  { id: 'PRD-1011', name: 'Zen Yoga Mat Premium', category: 'Sports', price: 1299, stock: 76, sold: 512, rating: 4.6, status: 'active' },
  { id: 'PRD-1012', name: 'Velvet Matte Lipstick', category: 'Beauty', price: 799, stock: 0, sold: 1533, rating: 4.7, status: 'draft' },
  { id: 'PRD-1013', name: 'Atlas Travel Duffel', category: 'Fashion', price: 3999, stock: 54, sold: 298, rating: 4.4, status: 'active' },
  { id: 'PRD-1014', name: 'Cascade Water Bottle 1L', category: 'Sports', price: 999, stock: 310, sold: 1780, rating: 4.8, status: 'active' },
  { id: 'PRD-1015', name: 'Nordic Throw Blanket', category: 'Home & Living', price: 2799, stock: 41, sold: 376, rating: 4.5, status: 'active' },
]

const CUSTOMERS = [
  ['Vamsi Krishna', 'vamsi.krishna@gmail.com'],
  ['Varun Reddy', 'varun.reddy@gmail.com'],
  ['Arjun Nair', 'arjun.nair@gmail.com'],
  ['Ajay Kumar', 'ajay.kumar@gmail.com'],
  ['Nani Varma', 'nani.varma@gmail.com'],
  ['Sai Teja', 'saiteja@gmail.com'],
  ['Rahul Sharma', 'rahul.sharma@gmail.com'],
  ['Karthik Rao', 'karthik.rao@gmail.com'],
  ['Priya Menon', 'priya.menon@gmail.com'],
  ['Ananya Iyer', 'ananya.iyer@gmail.com'],
  ['Rohit Verma', 'rohit.verma@gmail.com'],
  ['Deepika Patel', 'deepika.patel@gmail.com'],
]

const ROLLING = ['delivered', 'shipped', 'processing', 'pending']

export const orders = Array.from({ length: 34 }, (_, i) => {
  const [customer, email] = CUSTOMERS[i % CUSTOMERS.length]
  const date = new Date(2026, 8, 30 - (i % 30), 8 + ((i * 3) % 12), (i * 17) % 60).toISOString()
  const items = (i % 4) + 1
  const total = 999 + ((i * 251) % 9800) + items * 249 // orders roughly ₹1,200 – ₹11,800
  const status = i % 11 === 10 ? 'cancelled' : ROLLING[i % ROLLING.length]
  return { id: `ORD-${2451 - i}`, customer, email, date, items, total, status }
})

export const users = [
  { id: 'USR-01', name: 'Vamsi Krishna', email: 'vamsi.krishna@gmail.com', role: 'Admin', status: 'active', joined: 'Jan 12, 2024', lastActive: '2h ago' },
  { id: 'USR-02', name: 'Varun Reddy', email: 'varun.reddy@gmail.com', role: 'Editor', status: 'active', joined: 'Feb 03, 2024', lastActive: '18m ago' },
  { id: 'USR-03', name: 'Arjun Nair', email: 'arjun.nair@gmail.com', role: 'Editor', status: 'active', joined: 'Mar 22, 2024', lastActive: '1d ago' },
  { id: 'USR-04', name: 'Ajay Kumar', email: 'ajay.kumar@gmail.com', role: 'Support', status: 'active', joined: 'Apr 09, 2024', lastActive: '3h ago' },
  { id: 'USR-05', name: 'Nani Varma', email: 'nani.varma@gmail.com', role: 'Viewer', status: 'invited', joined: 'May 17, 2024', lastActive: '—' },
  { id: 'USR-06', name: 'Sai Teja', email: 'saiteja@gmail.com', role: 'Support', status: 'active', joined: 'Jun 28, 2024', lastActive: '52m ago' },
  { id: 'USR-07', name: 'Priya Menon', email: 'priya.menon@gmail.com', role: 'Editor', status: 'suspended', joined: 'Jul 14, 2024', lastActive: '6d ago' },
  { id: 'USR-08', name: 'Karthik Rao', email: 'karthik.rao@gmail.com', role: 'Viewer', status: 'active', joined: 'Aug 02, 2024', lastActive: '9h ago' },
  { id: 'USR-09', name: 'Deepika Patel', email: 'deepika.patel@gmail.com', role: 'Admin', status: 'active', joined: 'Sep 19, 2024', lastActive: '31m ago' },
  { id: 'USR-10', name: 'Rohit Verma', email: 'rohit.verma@gmail.com', role: 'Support', status: 'invited', joined: 'Oct 30, 2024', lastActive: '—' },
]

// Monthly revenue in ₹ (values in lakhs on the chart)
export const revenueSeries = [
  { month: 'Jan', revenue: 184000, target: 170000, orders: 268 },
  { month: 'Feb', revenue: 219500, target: 180000, orders: 301 },
  { month: 'Mar', revenue: 201000, target: 195000, orders: 288 },
  { month: 'Apr', revenue: 248000, target: 210000, orders: 342 },
  { month: 'May', revenue: 263500, target: 225000, orders: 367 },
  { month: 'Jun', revenue: 249200, target: 240000, orders: 349 },
  { month: 'Jul', revenue: 291000, target: 250000, orders: 402 },
  { month: 'Aug', revenue: 312500, target: 265000, orders: 431 },
  { month: 'Sep', revenue: 298700, target: 280000, orders: 418 },
  { month: 'Oct', revenue: 344000, target: 295000, orders: 466 },
  { month: 'Nov', revenue: 382500, target: 310000, orders: 523 },
  { month: 'Dec', revenue: 418000, target: 330000, orders: 578 },
]

export const trafficSources = [
  { name: 'Organic search', value: 38 },
  { name: 'Direct', value: 27 },
  { name: 'Social media', value: 19 },
  { name: 'Referral', value: 11 },
  { name: 'Email', value: 5 },
]

export const weekdaySessions = [
  { day: 'Mon', sessions: 3820 },
  { day: 'Tue', sessions: 4310 },
  { day: 'Wed', sessions: 4680 },
  { day: 'Thu', sessions: 4120 },
  { day: 'Fri', sessions: 5240 },
  { day: 'Sat', sessions: 3410 },
  { day: 'Sun', sessions: 2960 },
]

export const categoryShare = [
  { name: 'Electronics', value: 36 },
  { name: 'Fashion', value: 24 },
  { name: 'Sports', value: 17 },
  { name: 'Home & Living', value: 14 },
  { name: 'Beauty', value: 9 },
]