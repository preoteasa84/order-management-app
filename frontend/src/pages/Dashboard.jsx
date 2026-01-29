import React from "react";
import { FileText, DollarSign, Check } from "lucide-react";

const Dashboard = ({ orders, clients }) => {
  const today = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter((o) => o.date === today);

  const stats = {
    totalOrders: todayOrders.length,
    totalValue: todayOrders.reduce(
      (sum, o) => sum + (o.totalWithVAT || 0),
      0,
    ),
    immediatePayment: todayOrders.filter((o) => o.paymentType === "immediate")
      .length,
    creditPayment: todayOrders.filter((o) => o.paymentType === "credit")
      .length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h2>

      {/* Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1">Comenzi astăzi</p>
              <p className="text-3xl sm:text-4xl font-bold text-gray-800">
                {stats.totalOrders}
              </p>
            </div>
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1">Valoare totală</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                {stats.totalValue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">RON</p>
            </div>
            <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1">Plată la zi</p>
              <p className="text-3xl sm:text-4xl font-bold text-gray-800">
                {stats.immediatePayment}
              </p>
            </div>
            <Check className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1">Cu termen</p>
              <p className="text-3xl sm:text-4xl font-bold text-gray-800">
                {stats.creditPayment}
              </p>
            </div>
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Orders - Mobile Optimized */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Comenzi recente</h3>
        {todayOrders.length === 0 ? (
          <p className="text-gray-500 text-sm">Nu există comenzi astăzi</p>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {todayOrders.slice(0, 5).map((order) => {
              const client = clients.find((c) => c.id === order.clientId);
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">
                      {client?.nume || "Client necunoscut"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                      {order.items?.length || 0} produse
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-sm sm:text-base whitespace-nowrap">
                      {(order.totalWithVAT || 0).toFixed(2)} RON
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                      {order.paymentType === "immediate"
                        ? "💰 Plată la zi"
                        : "📄 Cu termen"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
