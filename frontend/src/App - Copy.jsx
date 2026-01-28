import React, { useState } from "react";
import {
  Users,
  Package,
  FileText,
  TrendingUp,
  LogOut,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Download,
  Search,
  Filter,
  Building2,
  ShoppingCart,
  Eye,
  UserCheck,
  Clock,
  Save,
  XCircle,
  CheckCircle,
} from "lucide-react";

const initialData = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "admin123",
      role: "admin",
      name: "Administrator",
      zone: null,
    },
    {
      id: 2,
      username: "vanzator1",
      password: "vanz123",
      role: "vanzator",
      name: "Ion Popescu",
      zone: "Brasov",
    },
    {
      id: 3,
      username: "vanzator2",
      password: "vanz123",
      role: "vanzator",
      name: "Maria Ionescu",
      zone: "Covasna",
    },
    {
      id: 4,
      username: "birou",
      password: "birou123",
      role: "birou",
      name: "Birou Central",
      zone: null,
    },
  ],
  clients: [
    {
      id: 1,
      cui: "RO12345678",
      name: "SC TECH SOLUTIONS SRL",
      address: "Str. Principala 1, Brasov",
      zone: "Brasov",
      vanzator_id: 2,
    },
    {
      id: 2,
      cui: "RO87654321",
      name: "SC INNOVATION GRUP SRL",
      address: "Str. Libertatii 45, Sfantu Gheorghe",
      zone: "Covasna",
      vanzator_id: 3,
    },
    {
      id: 3,
      cui: "RO11223344",
      name: "SC DIGITAL CONSTRUCT SRL",
      address: "Bd. Unirii 12, Brasov",
      zone: "Brasov",
      vanzator_id: 2,
    },
  ],
  products: [
    {
      id: 1,
      cod_intern: "P001",
      denumire: "Produs Standard A",
      um: "buc",
      activ: true,
    },
    {
      id: 2,
      cod_intern: "P002",
      denumire: "Produs Standard B",
      um: "kg",
      activ: true,
    },
    {
      id: 3,
      cod_intern: "P003",
      denumire: "Produs Premium C",
      um: "buc",
      activ: true,
    },
  ],
  contracts: [
    {
      id: 1,
      client_id: 1,
      produs_id: 1,
      cod_produs_client: "CLIENT1-A",
      pret: 150.0,
    },
    {
      id: 2,
      client_id: 1,
      produs_id: 2,
      cod_produs_client: "CLIENT1-B",
      pret: 85.5,
    },
    {
      id: 3,
      client_id: 2,
      produs_id: 1,
      cod_produs_client: "INNO-STD-A",
      pret: 145.0,
    },
  ],
  orders: [
    {
      id: 1,
      numar: "CMD-2026-001",
      client_id: 1,
      vanzator_id: 2,
      data: "2026-01-08",
      status: "draft",
      validata: false,
      observatii: "Livrare urgenta",
      items: [{ produs_id: 1, cantitate: 50, pret: 150.0 }],
    },
  ],
  nextOrderNumber: 2,
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const user = data.users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setCurrentUser(user);
    } else {
      alert("Username sau parolă greșită! ");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <ShoppingCart className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">
              Sistem Gestionare Comenzi
            </h1>
            <p className="text-gray-600 mt-2">Prototip Complet v1.0</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parolă
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="admin123"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium"
            >
              Login
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
            <p className="font-semibold text-gray-700 mb-2">Conturi demo:</p>
            <p className="text-gray-600">Admin: admin / admin123</p>
            <p className="text-gray-600">Vanzator: vanzator1 / vanz123</p>
            <p className="text-gray-600">Birou: birou / birou123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Gestionare Comenzi
              </h1>
              <p className="text-sm text-gray-600">
                {currentUser.name} - {currentUser.role.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentUser(null)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
                activeTab === "orders"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600"
              }`}
            >
              <FileText className="w-4 h-4" />
              Comenzi
            </button>
            {currentUser.role === "admin" && (
              <>
                <button
                  onClick={() => setActiveTab("clients")}
                  className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
                    activeTab === "clients"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Clienti
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
                    activeTab === "products"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Produse
                </button>
                <button
                  onClick={() => setActiveTab("contracts")}
                  className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
                    activeTab === "contracts"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Contracte
                </button>
              </>
            )}
            {(currentUser.role === "birou" || currentUser.role === "admin") && (
              <button
                onClick={() => setActiveTab("export")}
                className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
                  activeTab === "export"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600"
                }`}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "dashboard" && (
          <Dashboard data={data} currentUser={currentUser} />
        )}
        {activeTab === "orders" && (
          <OrdersTab data={data} setData={setData} currentUser={currentUser} />
        )}
        {activeTab === "clients" && currentUser.role === "admin" && (
          <ClientsTab data={data} setData={setData} />
        )}
        {activeTab === "products" && currentUser.role === "admin" && (
          <ProductsTab data={data} setData={setData} />
        )}
        {activeTab === "contracts" && currentUser.role === "admin" && (
          <ContractsTab data={data} setData={setData} />
        )}
        {activeTab === "export" && <ExportTab data={data} />}
      </main>
    </div>
  );
};

const Dashboard = ({ data, currentUser }) => {
  const userOrders =
    currentUser.role === "vanzator"
      ? data.orders.filter((o) => o.vanzator_id === currentUser.id)
      : data.orders;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Comenzi</p>
              <p className="text-2xl font-bold text-gray-900">
                {userOrders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-900">
                {userOrders.filter((o) => !o.validata).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Validate</p>
              <p className="text-2xl font-bold text-gray-900">
                {userOrders.filter((o) => o.validata).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Comenzi Recente
        </h3>
        <div className="space-y-3">
          {userOrders.map((order) => {
            const client = data.clients.find((c) => c.id === order.client_id);
            const total = order.items.reduce(
              (sum, item) => sum + item.cantitate * item.pret,
              0
            );

            return (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{order.numar}</p>
                  <p className="text-sm text-gray-600">{client?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {total.toFixed(2)} RON
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      order.validata
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.validata ? "Validata" : "Draft"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const OrdersTab = ({ data, setData, currentUser }) => {
  const [showNew, setShowNew] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [items, setItems] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editItems, setEditItems] = useState([]);
  const saveEditedOrder = () => {
    if (editItems.length === 0) {
      alert("Adauga cel putin un produs!");
      return;
    }

    const totalAmount = editItems.reduce((s, i) => s + i.cantitate * i.pret, 0);

    setData({
      ...data,
      orders: data.orders.map((o) =>
        o.id === editingOrder.id
          ? { ...o, items: editItems, total_amount: totalAmount }
          : o
      ),
    });

    setEditingOrder(null);
    setEditItems([]);
  };

  const addEditItem = (contract) => {
    const prod = data.products.find((p) => p.id === contract.produs_id);
    const qty = prompt("Introdu cantitatea:", "1");
    if (qty && Number(qty) > 0) {
      setEditItems([
        ...editItems,
        {
          produs_id: contract.produs_id,
          cantitate: Number(qty),
          pret: contract.pret,
          cod: prod.cod_intern,
          cod_client: contract.cod_produs_client,
        },
      ]);
    }
  };

  const removeEditItem = (idx) => {
    setEditItems(editItems.filter((_, i) => i !== idx));
  };

  const updateEditItemQty = (idx, newQty) => {
    const updated = [...editItems];
    updated[idx].cantitate = Math.max(1, Number(newQty));
    setEditItems(updated);
  };

  const userClients =
    currentUser.role === "vanzator"
      ? data.clients.filter((c) => c.vanzator_id === currentUser.id)
      : data.clients;

  const userOrders =
    currentUser.role === "vanzator"
      ? data.orders.filter((o) => o.vanzator_id === currentUser.id)
      : data.orders;

  const handleValidate = (orderId) => {
    setData({
      ...data,
      orders: data.orders.map((o) =>
        o.id === orderId ? { ...o, validata: true, status: "validata" } : o
      ),
    });
  };

  const contracts = selectedClient
    ? data.contracts.filter((c) => c.client_id === Number(selectedClient))
    : [];

  const addItem = (contract) => {
    const prod = data.products.find((p) => p.id === contract.produs_id);
    const qty = prompt("Introdu cantitatea:", "1");
    if (qty && Number(qty) > 0) {
      setItems([
        ...items,
        {
          produs_id: contract.produs_id,
          cantitate: Number(qty),
          pret: contract.pret,
          cod: prod.cod_intern,
          cod_client: contract.cod_produs_client,
        },
      ]);
    }
  };

  const saveOrder = () => {
    if (!selectedClient || items.length === 0) {
      alert("Selecteaza client si adauga produse! ");
      return;
    }

    const newOrder = {
      id: Date.now(),
      numar: `CMD-2026-${String(data.nextOrderNumber).padStart(3, "0")}`,
      client_id: Number(selectedClient),
      vanzator_id: currentUser.id,
      data: new Date().toISOString().split("T")[0],
      status: "draft",
      validata: false,
      observatii: "",
      items,
    };

    setData({
      ...data,
      orders: [...data.orders, newOrder],
      nextOrderNumber: data.nextOrderNumber + 1,
    });
    setShowNew(false);
    setSelectedClient("");
    setItems([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Comenzi</h2>
        {currentUser.role === "vanzator" && (
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            Comanda Noua
          </button>
        )}
      </div>

      {viewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{viewOrder.numar}</h3>
                  <p className="text-sm text-gray-600">
                    {
                      data.clients.find((c) => c.id === viewOrder.client_id)
                        ?.name
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    Data: {viewOrder.data}
                  </p>
                </div>
                <button
                  onClick={() => setViewOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Produse: </h4>
                <div className="space-y-2">
                  {viewOrder.items.map((item, idx) => {
                    const product = data.products.find(
                      (p) => p.id === item.produs_id
                    );
                    const contract = data.contracts.find(
                      (c) =>
                        c.client_id === viewOrder.client_id &&
                        c.produs_id === item.produs_id
                    );
                    return (
                      <div
                        key={idx}
                        className="flex justify-between p-3 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="font-medium">{product?.cod_intern}</p>
                          <p className="text-sm text-gray-600">
                            {contract?.cod_produs_client}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.cantitate} {product?.um} ×{" "}
                            {item.pret.toFixed(2)} RON
                          </p>
                        </div>
                        <p className="font-semibold">
                          {(item.cantitate * item.pret).toFixed(2)} RON
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-lg font-semibold">TOTAL: </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {viewOrder.items
                      .reduce((s, i) => s + i.cantitate * i.pret, 0)
                      .toFixed(2)}{" "}
                    RON
                  </span>
                </div>

                {viewOrder.observatii && (
                  <div className="mt-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm font-medium text-blue-900">
                      Observații:{" "}
                    </p>
                    <p className="text-sm text-blue-800">
                      {viewOrder.observatii}
                    </p>
                  </div>
                )}

                {currentUser.role === "admin" && !viewOrder.validata && (
                  <button
                    onClick={() => {
                      handleValidate(viewOrder.id);
                      setViewOrder(null);
                    }}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700"
                  >
                    <UserCheck className="w-5 h-5" />
                    Validează Comanda
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">
                    Editare: {editingOrder.numar}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {
                      data.clients.find((c) => c.id === editingOrder.client_id)
                        ?.name
                    }
                  </p>
                </div>
                <button
                  onClick={() => setEditingOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Produse disponibile:</h4>
                <div className="space-y-2 mb-4">
                  {data.contracts
                    .filter((c) => c.client_id === editingOrder.client_id)
                    .map((ct) => {
                      const prod = data.products.find(
                        (p) => p.id === ct.produs_id
                      );
                      const alreadyAdded = editItems.some(
                        (i) => i.produs_id === ct.produs_id
                      );
                      return (
                        <div
                          key={ct.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span>
                            {prod?.cod_intern} - {ct.pret} RON
                          </span>
                          {!alreadyAdded && (
                            <button
                              onClick={() => addEditItem(ct)}
                              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Adauga
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>

                <h4 className="font-semibold mb-3">Produse în comandă:</h4>
                <div className="space-y-3">
                  {editItems.map((item, idx) => {
                    const product = data.products.find(
                      (p) => p.id === item.produs_id
                    );
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{product?.cod_intern}</p>
                          <p className="text-sm text-gray-600">
                            {item.cod_client}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={item.cantitate}
                            onChange={(e) =>
                              updateEditItemQty(idx, e.target.value)
                            }
                            className="w-16 px-2 py-1 border rounded text-center"
                            min="1"
                          />
                          <span className="text-sm text-gray-600">
                            {product?.um}
                          </span>
                          <span className="font-semibold w-20 text-right">
                            {(item.cantitate * item.pret).toFixed(2)} RON
                          </span>
                          <button
                            onClick={() => removeEditItem(idx)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-lg font-semibold">TOTAL: </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {editItems
                      .reduce((s, i) => s + i.cantitate * i.pret, 0)
                      .toFixed(2)}{" "}
                    RON
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={saveEditedOrder}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-5 h-5" />
                    Salvează Modificări
                  </button>
                  <button
                    onClick={() => setEditingOrder(null)}
                    className="flex-1 bg-gray-300 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-400"
                  >
                    Anulează
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNew && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold">Comanda Noua</h3>

          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Selecteaza Client</option>
            {userClients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {contracts.length > 0 && (
            <div>
              <p className="font-medium mb-2">Produse: </p>
              {contracts.map((ct) => {
                const prod = data.products.find((p) => p.id === ct.produs_id);
                return (
                  <div
                    key={ct.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2"
                  >
                    <span>
                      {prod?.cod_intern} - {ct.pret} RON
                    </span>
                    <button
                      onClick={() => addItem(ct)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded"
                    >
                      Adauga
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {items.length > 0 && (
            <div>
              <p className="font-medium mb-2">Cos: </p>
              {items.map((it, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-2 bg-gray-100 rounded mb-1"
                >
                  <span>
                    {it.cod} ({it.cod_client}) x {it.cantitate}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {(it.cantitate * it.pret).toFixed(2)} RON
                    </span>
                    <button
                      onClick={() =>
                        setItems(items.filter((_, idx) => idx !== i))
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-2 p-2 bg-indigo-50 rounded font-semibold">
                TOTAL:{" "}
                {items.reduce((s, i) => s + i.cantitate * i.pret, 0).toFixed(2)}{" "}
                RON
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={saveOrder}
              className="flex-1 bg-indigo-600 text-white py-2 rounded"
            >
              Salveaza
            </button>
            <button
              onClick={() => setShowNew(false)}
              className="flex-1 bg-gray-200 py-2 rounded"
            >
              Anuleaza
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">Lista Comenzi</h3>
        {userOrders.map((order) => {
          const client = data.clients.find((c) => c.id === order.client_id);
          const vanzator = data.users.find((u) => u.id === order.vanzator_id);
          const total = order.items.reduce(
            (s, i) => s + i.cantitate * i.pret,
            0
          );
          return (
            <div key={order.id} className="border-b py-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium">{order.numar}</p>
                  <p className="text-sm text-gray-600">{client?.name}</p>
                  <p className="text-xs text-gray-500">{order.data}</p>
                </div>

                {(currentUser.role === "admin" ||
                  currentUser.role === "birou") && (
                  <div className="flex-1 text-center">
                    <p className="text-xs text-gray-500 uppercase">Vânzător</p>
                    <p className="font-medium text-sm">{vanzator?.name}</p>
                  </div>
                )}

                <div className="text-right">
                  <p className="font-semibold">{total.toFixed(2)} RON</p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      order.validata
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.validata ? "Validata" : "Draft"}
                  </span>
                </div>
              </div>

              {/* CONSOLIDAT:  Butoanele toate într-un singur div */}
              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  onClick={() => setViewOrder(order)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Vizualizare
                </button>

                {!order.validata && (
                  <button
                    onClick={() => {
                      setEditingOrder(order);
                      setEditItems([...order.items]);
                    }}
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editare
                  </button>
                )}

                {(currentUser.role === "admin" ||
                  currentUser.role === "birou") &&
                  !order.validata && (
                    <button
                      onClick={() => handleValidate(order.id)}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                    >
                      <UserCheck className="w-4 h-4" />
                      Valideaza
                    </button>
                  )}

                {currentUser.role === "admin" && order.validata && (
                  <button
                    onClick={() => {
                      setData({
                        ...data,
                        orders: data.orders.map((o) =>
                          o.id === order.id
                            ? { ...o, validata: false, status: "draft" }
                            : o
                        ),
                      });
                    }}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                  >
                    <X className="w-4 h-4" />
                    Devalideaza
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ClientsTab = ({ data, setData }) => {
  const [show, setShow] = useState(false);
  const [cui, setCui] = useState("");
  const [name, setName] = useState("");
  const [zone, setZone] = useState("");
  const [vanzatorId, setVanzatorId] = useState("");

  const save = () => {
    if (!cui || !name || !zone || !vanzatorId) {
      alert("Completeaza toate campurile! ");
      return;
    }
    setData({
      ...data,
      clients: [
        ...data.clients,
        {
          id: Date.now(),
          cui,
          name,
          address: "",
          zone,
          vanzator_id: Number(vanzatorId),
        },
      ],
    });
    setShow(false);
    setCui("");
    setName("");
    setZone("");
    setVanzatorId("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clienti</h2>
        <button
          onClick={() => setShow(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Adauga Client
        </button>
      </div>

      {show && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <input
            placeholder="CUI"
            value={cui}
            onChange={(e) => setCui(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            placeholder="Denumire"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            placeholder="Zona"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <select
            value={vanzatorId}
            onChange={(e) => setVanzatorId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Selecteaza Vanzator</option>
            {data.users
              .filter((u) => u.role === "vanzator")
              .map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={save}
              className="flex-1 bg-indigo-600 text-white py-2 rounded"
            >
              Salveaza
            </button>
            <button
              onClick={() => setShow(false)}
              className="flex-1 bg-gray-200 py-2 rounded"
            >
              Anuleaza
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                CUI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Denumire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Zona
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.clients.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4 text-sm">{c.cui}</td>
                <td className="px-6 py-4 text-sm font-medium">{c.name}</td>
                <td className="px-6 py-4 text-sm">{c.zone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductsTab = ({ data, setData }) => {
  const [show, setShow] = useState(false);
  const [cod, setCod] = useState("");
  const [name, setName] = useState("");
  const [um, setUm] = useState("buc");

  const save = () => {
    if (!cod || !name) {
      alert("Completeaza toate campurile!");
      return;
    }
    setData({
      ...data,
      products: [
        ...data.products,
        { id: Date.now(), cod_intern: cod, denumire: name, um, activ: true },
      ],
    });
    setShow(false);
    setCod("");
    setName("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Produse</h2>
        <button
          onClick={() => setShow(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Adauga Produs
        </button>
      </div>

      {show && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <input
            placeholder="Cod Intern"
            value={cod}
            onChange={(e) => setCod(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            placeholder="Denumire"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <select
            value={um}
            onChange={(e) => setUm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="buc">bucata</option>
            <option value="kg">kilogram</option>
            <option value="set">set</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={save}
              className="flex-1 bg-indigo-600 text-white py-2 rounded"
            >
              Salveaza
            </button>
            <button
              onClick={() => setShow(false)}
              className="flex-1 bg-gray-200 py-2 rounded"
            >
              Anuleaza
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cod
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Denumire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                UM
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.products.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 text-sm font-medium">
                  {p.cod_intern}
                </td>
                <td className="px-6 py-4 text-sm">{p.denumire}</td>
                <td className="px-6 py-4 text-sm">{p.um}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ContractsTab = ({ data, setData }) => {
  const [show, setShow] = useState(false);
  const [clientId, setClientId] = useState("");
  const [produsId, setProdusId] = useState("");
  const [codClient, setCodClient] = useState("");
  const [pret, setPret] = useState("");

  const save = () => {
    if (!clientId || !produsId || !codClient || !pret) {
      alert("Completeaza toate campurile!");
      return;
    }
    setData({
      ...data,
      contracts: [
        ...data.contracts,
        {
          id: Date.now(),
          client_id: Number(clientId),
          produs_id: Number(produsId),
          cod_produs_client: codClient,
          pret: parseFloat(pret),
        },
      ],
    });
    setShow(false);
    setClientId("");
    setProdusId("");
    setCodClient("");
    setPret("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contracte</h2>
        <button
          onClick={() => setShow(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Adauga Contract
        </button>
      </div>

      {show && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Selecteaza Client</option>
            {data.clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={produsId}
            onChange={(e) => setProdusId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Selecteaza Produs</option>
            {data.products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.cod_intern} - {p.denumire}
              </option>
            ))}
          </select>
          <input
            placeholder="Cod Produs Client"
            value={codClient}
            onChange={(e) => setCodClient(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            placeholder="Pret"
            type="number"
            value={pret}
            onChange={(e) => setPret(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              className="flex-1 bg-indigo-600 text-white py-2 rounded"
            >
              Salveaza
            </button>
            <button
              onClick={() => setShow(false)}
              className="flex-1 bg-gray-200 py-2 rounded"
            >
              Anuleaza
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Produs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cod Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Pret
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.contracts.map((ct) => {
              const client = data.clients.find((c) => c.id === ct.client_id);
              const produs = data.products.find((p) => p.id === ct.produs_id);
              return (
                <tr key={ct.id}>
                  <td className="px-6 py-4 text-sm">{client?.name}</td>
                  <td className="px-6 py-4 text-sm">{produs?.cod_intern}</td>
                  <td className="px-6 py-4 text-sm font-medium text-indigo-600">
                    {ct.cod_produs_client}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {ct.pret.toFixed(2)} RON
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ExportTab = ({ data }) => {
  const validatedOrders = data.orders.filter((o) => o.validata);

  const exportData = () => {
    const csvData = [];
    csvData.push([
      "Numar Comanda",
      "Data",
      "Client",
      "CUI",
      "Cod Intern",
      "Cod Client",
      "Denumire",
      "Cantitate",
      "UM",
      "Pret",
      "Total",
    ]);

    validatedOrders.forEach((order) => {
      const client = data.clients.find((c) => c.id === order.client_id);
      order.items.forEach((item) => {
        const product = data.products.find((p) => p.id === item.produs_id);
        const contract = data.contracts.find(
          (c) =>
            c.client_id === order.client_id && c.produs_id === item.produs_id
        );
        csvData.push([
          order.numar,
          order.data,
          client?.name || "",
          client?.cui || "",
          product?.cod_intern || "",
          contract?.cod_produs_client || "",
          product?.denumire || "",
          item.cantitate,
          product?.um || "",
          item.pret.toFixed(2),
          (item.cantitate * item.pret).toFixed(2),
        ]);
      });
    });

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `comenzi_validate_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Export si Rapoarte</h2>

      <div className="grid grid-cols-1 md: grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Comenzi</p>
          <p className="text-2xl font-bold">{data.orders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Validate</p>
          <p className="text-2xl font-bold">{validatedOrders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Valoare Totala</p>
          <p className="text-2xl font-bold">
            {validatedOrders
              .reduce(
                (sum, o) =>
                  sum + o.items.reduce((s, i) => s + i.cantitate * i.pret, 0),
                0
              )
              .toFixed(0)}{" "}
            RON
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Export pentru Saga</h3>
        <p className="text-gray-600 mb-4">
          Exportă toate comenzile validate în format CSV (Excel).
        </p>
        <button
          onClick={exportData}
          disabled={validatedOrders.length === 0}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          Descarca Excel ({validatedOrders.length} comenzi)
        </button>
        <p className="text-sm text-gray-500 mt-3">
          Fisierul va fi descărcat automat ca CSV (se deschide în Excel)
        </p>
      </div>
    </div>
  );
};

export default App;
