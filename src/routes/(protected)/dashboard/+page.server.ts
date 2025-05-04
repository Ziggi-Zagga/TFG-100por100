//FAKE DATA cambiar cuando se tengan las tablas



export const load = async () => {
    const userName = "User";
    const unreadAlerts = 3;
    const today = new Date().toLocaleDateString("en-GB");

    const metrics = [
        { title: "Total Incidents", value: 1204, change: "5.2%", color: "bg-blue-200", route: "dashboard/incidents" },
        { title: "Resolved Incidents", value: 984, change: "4.7%", color: "bg-indigo-200", route: "dasboards/incidents/resolved" },
        { title: "Products in Stock", value: 3210, change: "1.1%", color: "bg-violet-200", route: "dashboard/inventory" },
        { title: "Pending Reviews", value: 75, change: "-2.5%", color: "bg-purple-200", route: "/reviews" },
    ];

    const topProducts = [
        { name: "Product A", sku: "A123", sold: 1200, stock: 30 },
        { name: "Product B", sku: "B456", sold: 950, stock: 12 },
        { name: "Product C", sku: "C789", sold: 860, stock: 0 },
    ];

    const stockChart = [
        { month: "Jan", stock: 300, incidents: 45 },
        { month: "Feb", stock: 280, incidents: 50 },
        { month: "Mar", stock: 310, incidents: 32 },
        { month: "Apr", stock: 290, incidents: 29 },
    ];

    const financeByMonth = [
        { month: "Jan", revenue: 4500, expenses: 3900 },
        { month: "Feb", revenue: 2200, expenses: 3400 },
        { month: "Mar", revenue: 5500, expenses: 4800 },
        { month: "Apr", revenue: 2100, expenses: 1500 },
        { month: "May", revenue: 3200, expenses: 1700 },
    ];

    return {
        userName,
        unreadAlerts,
        today,
        metrics,
        topProducts,
        financeByMonth
    };
}