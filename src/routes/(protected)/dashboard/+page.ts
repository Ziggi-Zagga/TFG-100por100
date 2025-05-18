export const ssr = false;

export const load = async () => {
    return {
        userName: "User",
        unreadAlerts: 3,
        today: new Date().toLocaleDateString("en-GB"),
        metrics: [
            { title: "Total Incidents", value: 1204, change: "5.2%", color: "bg-blue-200", route: "dashboard/incidents" },
            { title: "Resolved Incidents", value: 984, change: "4.7%", color: "bg-indigo-200", route: "dasboards/incidents/resolved" },
            { title: "Products in Stock", value: 3210, change: "1.1%", color: "bg-violet-200", route: "dashboard/inventory" },
            { title: "Total Orders", value: 75, change: "-2.5%", color: "bg-purple-200", route: "dashboard/orders" },
        ],
        topProducts: [
            { name: "Product A", sku: "A123", sold: 1200, stock: 30 },
            { name: "Product B", sku: "B456", sold: 950, stock: 12 },
            { name: "Product C", sku: "C789", sold: 860, stock: 0 },
        ],
        financeByMonth: [
            { month: "Jan", revenue: 4500, expenses: 3900 },
            { month: "Feb", revenue: 2200, expenses: 3400 },
            { month: "Mar", revenue: 5500, expenses: 4800 },
            { month: "Apr", revenue: 2100, expenses: 1500 },
        ],
        lastOrders: [
            { id: "1", product: "Product A", status: "Delivered", date: "2024-05-15" },
            { id: "2", product: "Product B", status: "Processing", date: "2024-05-14" },
            { id: "3", product: "Product C", status: "Pending", date: "2024-05-13" },
        ]
    };
};
