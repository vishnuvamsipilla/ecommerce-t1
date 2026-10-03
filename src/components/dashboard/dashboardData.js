export const salesByRange = {
  "7d": [42, 58, 48, 72, 64, 85, 78],
  "30d": [38, 52, 46, 61, 58, 72, 66, 81, 76, 88, 71, 84],
  "90d": [32, 44, 39, 58, 53, 67, 62, 76, 70, 82, 78, 91],
};

export const chartLabels = {
  "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "30d": ["1", "4", "7", "10", "13", "16", "19", "22", "25", "28", "29", "30"],
  "90d": [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

export const navigationItems = [
  { label: "Overview", icon: "grid", path: "/admin/dashboard" },
  { label: "Products", icon: "box", path: "/admin/products" },
  { label: "Categories", icon: "tag", path: "/admin/categories" },
  { label: "Orders", icon: "receipt" },
  { label: "Customers", icon: "users" },
];

export const activities = [
  {
    initials: "JM",
    name: "Jordan Miller",
    action: "placed an order",
    time: "8 min ago",
    tone: "blue",
  },
  {
    initials: "AK",
    name: "Ava Khan",
    action: "created an account",
    time: "24 min ago",
    tone: "violet",
  },
  {
    initials: "RS",
    name: "Riley Smith",
    action: "requested a return",
    time: "1 hr ago",
    tone: "amber",
  },
  {
    initials: "NC",
    name: "Noah Chen",
    action: "placed an order",
    time: "2 hrs ago",
    tone: "green",
  },
];

export const topProducts = [
  {
    name: "Minimal Leather Tote",
    category: "Accessories",
    sold: 124,
    revenue: "$18,476",
    trend: "18.2%",
  },
  {
    name: "Relaxed Cotton Shirt",
    category: "Apparel",
    sold: 98,
    revenue: "$9,702",
    trend: "11.6%",
  },
  {
    name: "Contour Running Shoe",
    category: "Footwear",
    sold: 76,
    revenue: "$8,360",
    trend: "8.9%",
  },
];
