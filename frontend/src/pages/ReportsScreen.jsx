import React, { useState, useMemo } from "react";
import { Calendar, Download, RefreshCw } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ReportsScreen = ({
  orders,
  clients,
  products,
  agents,
  selectedDate,
  setSelectedDate,
  currentUser,
  showMessage,
}) => {
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("all");

  // Filtrează comenzile după perioadă și agent
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      const startDate = dateStart ? new Date(dateStart) : new Date(0);
      const endDate = dateEnd ? new Date(dateEnd) : new Date();

      const dateMatch =
        orderDate >= startDate && orderDate <= endDate;
      const agentMatch =
        selectedAgent === "all" || order.agentId === selectedAgent;

      return dateMatch && agentMatch;
    });
  }, [orders, dateStart, dateEnd, selectedAgent]);

  // Calculeaza total vânzări pe produs
  const productSales = useMemo(() => {
    const sales = {};
    products.forEach((p) => {
      sales[p.id] = {
        name: p.descriere,
        quantity: 0,
        value: 0,
        um: p.um,
      };
    });

    filteredOrders.forEach((order) => {
      order.items?.forEach((item) => {
        if (sales[item.productId]) {
          sales[item.productId].quantity += item.quantity;
          sales[item.productId].value += item.quantity * item.price;
        }
      });
    });

    return Object.values(sales).filter((s) => s.quantity > 0);
  }, [filteredOrders, products]);

  // Calculeaza vânzări pe agent
  const agentSales = useMemo(() => {
    const sales = {};
    agents.forEach((a) => {
      sales[a.id] = { name: a.name, total: 0, orders: 0 };
    });

    filteredOrders.forEach((order) => {
      if (sales[order.agentId]) {
        sales[order.agentId].total += order.totalWithVAT || 0;
        sales[order.agentId].orders += 1;
      }
    });

    return Object.values(sales)
      .filter((s) => s.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [filteredOrders, agents]);

  // Top 5 agenți
  const topAgents = agentSales.slice(0, 5);

  // Total vânzări perioada
  const totalSales = filteredOrders.reduce(
    (sum, o) => sum + (o.totalWithVAT || 0),
    0,
  );

  const handleRefresh = () => {
    showMessage("Rapoarte reîncărcate!");
  };

  // Export PDF - Detaliat (pe comenzi)
  const exportDetailedPDF = () => {
    const doc = new jsPDF();
    const agent =
      selectedAgent === "all"
        ? "Toți agenții"
        : agents.find((a) => a.id === selectedAgent)?.name;

    doc.setFontSize(16);
    doc.text("Raport Comenzi - Detaliat", 14, 15);
    doc.setFontSize(10);
    doc.text(
      `Agent: ${agent} | Perioada: ${dateStart || "N/A"} - ${dateEnd || "N/A"}`,
      14,
      25,
    );

    const tableData = filteredOrders.map((order) => {
      const orderAgent = agents.find((a) => a.id === order.agentId);
      const orderClient = clients.find((c) => c.id === order.clientId);
      const itemsDescription = order.items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return `${product?.descriere || "N/A"}: ${item.quantity}${product?.um || ""}`;
        })
        .join(", ");

      return [
        order.date,
        orderClient?.nume || "N/A",
        orderAgent?.name || "N/A",
        itemsDescription,
        `${(order.totalWithVAT || 0).toFixed(2)} lei`,
      ];
    });

    doc.autoTable({
      head: [["Data", "Client", "Agent", "Produse", "Total"]],
      body: tableData,
      startY: 35,
      theme: "grid",
      columnStyles: { 3: { halign: "left" } },
    });

    doc.save(
      `raport_comenzi_${dateStart}_${dateEnd}_${new Date().getTime()}.pdf`,
    );
    showMessage("PDF descărcat!");
  };

  // Export PDF - Insumat (pe produs/agent)
  const exportSummaryPDF = () => {
    const doc = new jsPDF();
    const agent =
      selectedAgent === "all"
        ? "Toți agenții"
        : agents.find((a) => a.id === selectedAgent)?.name;

    doc.setFontSize(16);
    doc.text("Raport Vânzări - Insumat", 14, 15);
    doc.setFontSize(10);
    doc.text(
      `Agent: ${agent} | Perioada: ${dateStart || "N/A"} - ${dateEnd || "N/A"}`,
      14,
      25,
    );

    // Vânzări pe produs
    doc.setFontSize(12);
    doc.text("Vânzări pe Produs:", 14, 40);

    const productData = productSales.map((p) => [
      p.name,
      `${p.quantity} ${p.um}`,
      `${p.value.toFixed(2)} lei`,
    ]);

    doc.autoTable({
      head: [["Produs", "Cantitate", "Valoare"]],
      body: productData,
      startY: 45,
      theme: "grid",
    });

    // Vânzări pe agent
    const lastY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text("Vânzări pe Agent:", 14, lastY);

    const agentData = agentSales.map((a) => [
      a.name,
      a.orders.toString(),
      `${a.total.toFixed(2)} lei`,
    ]);

    doc.autoTable({
      head: [["Agent", "Comenzi", "Total"]],
      body: agentData,
      startY: lastY + 5,
      theme: "grid",
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total Perioada: ${totalSales.toFixed(2)} lei`, 14, finalY);

    doc.save(
      `raport_insumat_${dateStart}_${dateEnd}_${new Date().getTime()}.pdf`,
    );
    showMessage("PDF descărcat!");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">📊 Rapoarte</h2>
      </div>

      {/* FILTRE */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data inceput
            </label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data sfârşit
            </label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent
            </label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">Toți agenții</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleRefresh}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm transition"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* CARDS STATISTICI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Vânzări</p>
          <p className="text-2xl font-bold text-blue-600">
            {totalSales.toFixed(2)} lei
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Comenzi</p>
          <p className="text-2xl font-bold text-green-600">
            {filteredOrders.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Produse Vândute</p>
          <p className="text-2xl font-bold text-orange-600">
            {productSales.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Agenți Activi</p>
          <p className="text-2xl font-bold text-purple-600">
            {agentSales.length}
          </p>
        </div>
      </div>

      {/* TOP AGENȚI */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🏆 Top 5 Agenți
        </h3>
        <div className="space-y-3">
          {topAgents.map((agent, idx) => (
            <div key={agent.name} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{agent.name}</p>
                <p className="text-xs text-gray-500">{agent.orders} comenzi</p>
              </div>
              <p className="font-bold text-blue-600">
                {agent.total.toFixed(2)} lei
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* VÂNZĂRI PE PRODUS */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📦 Vânzări pe Produs
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Produs</th>
                <th className="px-4 py-2 text-center font-semibold">
                  Cantitate
                </th>
                <th className="px-4 py-2 text-right font-semibold">Valoare</th>
              </tr>
            </thead>
            <tbody>
              {productSales.map((product) => (
                <tr key={product.name} className="border-t border-gray-200">
                  <td className="px-4 py-2 font-medium">{product.name}</td>
                  <td className="px-4 py-2 text-center">
                    {product.quantity} {product.um}
                  </td>
                  <td className="px-4 py-2 text-right font-semibold">
                    {product.value.toFixed(2)} lei
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXPORT PDF */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📥 Export Rapoarte
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={exportDetailedPDF}
            className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-semibold transition"
          >
            <Download className="w-5 h-5" />
            PDF Detaliat (Comenzi)
          </button>
          <button
            onClick={exportSummaryPDF}
            className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-semibold transition"
          >
            <Download className="w-5 h-5" />
            PDF Insumat (Rezumat)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsScreen;