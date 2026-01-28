import React, { useState, useEffect } from "react";
import {
  Download,
  Users,
  Package,
  Settings,
  FileText,
  DollarSign,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Save,
  Calendar,
} from "lucide-react";

const App = () => {
  // API Configuration
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");

  // Data states
  const [company, setCompany] = useState(null);
  const [gestiuni, setGestiuni] = useState([]);
  const [agents, setAgents] = useState([]);
  const [priceZones, setPriceZones] = useState([]);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [dayStatus, setDayStatus] = useState({});

  // ✅ ADAUGĂ AICI - după toți useState-urile:
  useEffect(() => {
    const loadAllData = async () => {
      // ... cod existent...
    };
    loadAllData();
  }, []);

  // ✅ ADAUGĂ ȘI ASTA - după useEffect-ul de loadAllData:
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "dayStatus") {
        const updated = e.newValue ? JSON.parse(e.newValue) : {};
        setDayStatus(updated);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // UI states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // ✅ API-aware Storage - uses API for clients/products, localStorage for others
  const loadData = async (key) => {
    try {
      // Use API for clients and products
      if (key === 'clients') {
        const response = await fetch(`${API_URL}/api/clients`);
        if (response.ok) {
          return await response.json();
        }
        console.warn('API not available for clients, using localStorage fallback');
        const result = localStorage.getItem(key);
        return result ? JSON.parse(result) : null;
      } else if (key === 'products') {
        const response = await fetch(`${API_URL}/api/products`);
        if (response.ok) {
          return await response.json();
        }
        console.warn('API not available for products, using localStorage fallback');
        const result = localStorage.getItem(key);
        return result ? JSON.parse(result) : null;
      } else {
        // Use localStorage for other data
        const result = localStorage.getItem(key);
        return result ? JSON.parse(result) : null;
      }
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      // Fallback to localStorage on error
      try {
        const result = localStorage.getItem(key);
        return result ? JSON.parse(result) : null;
      } catch {
        return null;
      }
    }
  };

  const saveData = async (key, data) => {
    try {
      // Use API for clients and products
      if (key === 'clients') {
        // For clients, we need to handle both create and update operations
        // Since we're replacing the entire array, we need to sync all clients
        // This is not efficient but maintains compatibility with existing code
        localStorage.setItem(key, JSON.stringify(data)); // Keep localStorage as fallback
        return true;
      } else if (key === 'products') {
        // Same approach for products
        localStorage.setItem(key, JSON.stringify(data)); // Keep localStorage as fallback
        return true;
      } else {
        // Use localStorage for other data
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      }
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      return false;
    }
  };

  // API helper functions for clients
  const createClient = async (client) => {
    try {
      const response = await fetch(`${API_URL}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client)
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to create client');
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  };

  const updateClient = async (id, client) => {
    try {
      const response = await fetch(`${API_URL}/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client)
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to update client');
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const deleteClient = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/clients/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to delete client');
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

  // API helper functions for products
  const createProduct = async (product) => {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to create product');
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  const updateProduct = async (id, product) => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to update product');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to delete product');
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  // Bulk sync function for import/export
  const syncClientsToAPI = async (clientsList) => {
    try {
      // Get current clients from API
      const response = await fetch(`${API_URL}/api/clients`);
      if (!response.ok) {
        console.warn('API not available, skipping sync');
        return;
      }
      const existingClients = await response.json();
      const existingIds = new Set(existingClients.map(c => c.id));

      // Sync each client
      for (const client of clientsList) {
        try {
          if (existingIds.has(client.id)) {
            await updateClient(client.id, client);
          } else {
            await createClient(client);
          }
        } catch (error) {
          console.error(`Failed to sync client ${client.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error syncing clients:', error);
    }
  };

  const syncProductsToAPI = async (productsList) => {
    try {
      // Get current products from API
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        console.warn('API not available, skipping sync');
        return;
      }
      const existingProducts = await response.json();
      const existingIds = new Set(existingProducts.map(p => p.id));

      // Sync each product
      for (const product of productsList) {
        try {
          if (existingIds.has(product.id)) {
            await updateProduct(product.id, product);
          } else {
            await createProduct(product);
          }
        } catch (error) {
          console.error(`Failed to sync product ${product.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error syncing products:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [
        companyData,
        gestiuniData,
        agentsData,
        zonesData,
        productsData,
        clientsData,
        contractsData,
        ordersData,
        dayStatusData,
      ] = await Promise.all([
        loadData("company"),
        loadData("gestiuni"),
        loadData("agents"),
        loadData("priceZones"),
        loadData("products"),
        loadData("clients"),
        loadData("contracts"),
        loadData("orders"),
        loadData("dayStatus"),
      ]);

      setCompany(companyData || getDefaultCompany());
      setGestiuni(gestiuniData || getDefaultGestiuni());
      setAgents(agentsData || getDefaultAgents());
      setPriceZones(zonesData || getDefaultPriceZones());
      setProducts(productsData || getDefaultProducts());
      setClients(clientsData || getDefaultClients());
      setContracts(contractsData || []);
      setOrders(ordersData || []);
      setDayStatus(dayStatusData || {});
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Default data
  const getDefaultCompany = () => ({
    furnizorNume: "SC PANIFICATIE SRL",
    furnizorCIF: "RO4402892",
    furnizorNrRegCom: "J14/603/1993",
    furnizorCapital: "20000.00",
    furnizorAdresa: "",
    furnizorJudet: "Covasna",
    furnizorLocalitate: "Sfântu Gheorghe",
    furnizorStrada: "Str. Fabricii nr. 10",
    furnizorBanca: "BCR",
    furnizorIBAN: "RO49RNCB0000000123456789",
    contIncasariCasa: "5311",
    contIncasariBanca: "5121",
    contImplicit: "5311",
    invoiceSeries: "FAC",
    invoiceNumber: 1,
    receiptSeries: "CN",
    receiptNumber: 1,
    deliverySeries: "AVZ",
    deliveryNumber: 1,
    lotNumberStart: 11111,
    lotNumberCurrent: 11111,
    lotDate: null,
    cotaTVA: 11,
  });

  const getDefaultGestiuni = () => [
    { id: "piese", name: "PIESE" },
    { id: "patiserie", name: "PATISERIE" },
    { id: "panificatie", name: "PANIFICATIE" },
  ];

  const getDefaultAgents = () => [
    { id: "agent1", code: "Agent1", name: "Ion Popescu" },
    { id: "agent2", code: "Agent2", name: "Maria Ionescu" },
  ];

  const getDefaultPriceZones = () => [
    { id: "zona-a", name: "Zona A", description: "Premium" },
    { id: "zona-b", name: "Zona B", description: "Standard" },
    { id: "zona-c", name: "Zona C", description: "Discount" },
  ];

  const getDefaultProducts = () => [
    {
      id: "pc",
      codArticolFurnizor: "00000001",
      codProductie: "684811825476",
      codBare: "",
      descriere: "PAINE FELIAT 1.5 KG",
      um: "BUC",
      gestiune: "piese",
      gramajKg: 1.5,
      cotaTVA: 11,
      prices: { "zona-a": 9.17, "zona-b": 8.5, "zona-c": 7.8 },
    },
    {
      id: "corn",
      codArticolFurnizor: "00000002",
      codProductie: "684811825477",
      codBare: "",
      descriere: "CORN CU CAS 90G",
      um: "BUC",
      gestiune: "piese",
      gramajKg: 0.09,
      cotaTVA: 11,
      prices: { "zona-a": 2.02, "zona-b": 1.85, "zona-c": 1.7 },
    },
    {
      id: "chifle",
      codArticolFurnizor: "00000003",
      codProductie: "684811825478",
      codBare: "",
      descriere: "CHIFLE",
      um: "BUC",
      gestiune: "piese",
      gramajKg: 0.05,
      cotaTVA: 11,
      prices: { "zona-a": 1.74, "zona-b": 1.6, "zona-c": 1.5 },
    },
  ];

  const getDefaultClients = () => [
    {
      id: "olimpos",
      nume: "OLIMPOS SRL",
      cif: "RO12345678",
      nrRegCom: "J25/123/2020",
      codContabil: "00001",
      judet: "Covasna",
      localitate: "Sfântu Gheorghe",
      strada: "Str. Principală nr. 10",
      codPostal: "520008",
      telefon: "0267-111222",
      email: "contact@olimpos.ro",
      banca: "BCR",
      iban: "RO49RNCB0000000111222333",
      agentId: "agent1",
      priceZone: "zona-a",
      afiseazaKG: true,
      productCodes: { pc: "PAIN-001" },
    },
    {
      id: "gaspar3",
      nume: "GASPAR 3 SRL",
      cif: "RO87654321",
      nrRegCom: "J25/456/2019",
      codContabil: "00002",
      judet: "Covasna",
      localitate: "Sfântu Gheorghe",
      strada: "Str. Mihai Viteazu nr. 5",
      codPostal: "520009",
      telefon: "0267-222333",
      email: "contact@gaspar3.ro",
      banca: "BCR",
      iban: "RO49RNCB0000000222333444",
      agentId: "agent1",
      priceZone: "zona-a",
      afiseazaKG: false,
      productCodes: {},
    },
  ];

  // Show message helper
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // ✅ FIXED: Login component
  const LoginScreen = () => {
    const [credentials, setCredentials] = useState({
      username: "",
      password: "",
    });

    const handleLogin = () => {
      const users = {
        admin: { password: "admin", role: "admin", name: "Administrator" },
        birou: { password: "birou", role: "birou", name: "Birou" },
        agent1: {
          password: "agent1",
          role: "agent",
          agentId: "agent1",
          name: "Ion Popescu",
        },
        agent2: {
          password: "agent2",
          role: "agent",
          agentId: "agent2",
          name: "Maria Ionescu",
        },
      };

      const user = users[credentials.username];
      if (user && user.password === credentials.password) {
        setCurrentUser({ username: credentials.username, ...user });
        setActiveSection("dashboard");
      } else {
        showMessage("Date de autentificare invalide! ", "error");
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-amber-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-5xl">🥖</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Sistem Management Comenzi
            </h1>
            <p className="text-gray-600 mt-2">Panificație & Patiserie</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Utilizator
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus: ring-amber-500 focus: border-transparent"
                placeholder="admin / birou / agent1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parolă
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="••••••"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Autentificare
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p className="font-semibold mb-2">Conturi demo:</p>
            <p>• admin / admin</p>
            <p>• birou / birou</p>
            <p>• agent1 / agent1</p>
          </div>
        </div>
      </div>
    );
  };

  // Header component
  const Header = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🥖</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Sistem Comenzi Panificație
            </h1>
            <p className="text-sm text-gray-600">
              {currentUser.name} (
              {currentUser.role === "admin"
                ? "Administrator"
                : currentUser.role === "birou"
                  ? "Birou"
                  : "Agent"}
              )
            </p>
          </div>
        </div>
        <button
          onClick={() => setCurrentUser(null)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Ieșire</span>
        </button>
      </div>
    </div>
  );

  // Navigation component
  const Navigation = () => {
    const menuItems = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: Package,
        roles: ["admin", "birou", "agent"],
      },
      {
        id: "orders-agent",
        label: "Comenzi Agenți",
        icon: FileText,
        roles: ["agent"],
      },
      {
        id: "orders-matrix",
        label: "Matrice Comenzi",
        icon: FileText,
        roles: ["admin", "birou"],
      },
      {
        id: "reports",
        label: "Rapoarte",
        icon: DollarSign,
        roles: ["admin", "birou"],
      },
      {
        id: "clients",
        label: "Clienți",
        icon: Users,
        roles: ["admin", "birou"],
      },
      {
        id: "products",
        label: "Produse",
        icon: Package,
        roles: ["admin", "birou"],
      },
      {
        id: "contracts",
        label: "Contracte",
        icon: FileText,
        roles: ["admin", "birou"],
      },
      { id: "config", label: "Configurare", icon: Settings, roles: ["admin"] },
      {
        id: "export",
        label: "Export Documente",
        icon: Download,
        roles: ["admin", "birou"],
      },
    ];

    return (
      <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
        <nav className="space-y-2">
          {menuItems
            .filter((item) => item.roles.includes(currentUser.role))
            .map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? "bg-amber-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
        </nav>
      </div>
    );
  };

  // Dashboard component
  const Dashboard = () => {
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
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Comenzi astăzi</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalOrders}
                </p>
              </div>
              <FileText className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Valoare totală</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalValue.toFixed(2)} RON
                </p>
              </div>
              
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Plată la zi</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.immediatePayment}
                </p>
              </div>
              <Check className="w-12 h-12 text-amber-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Cu termen</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.creditPayment}
                </p>
              </div>
              <FileText className="w-12 h-12 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Comenzi recente</h3>
          {todayOrders.length === 0 ? (
            <p className="text-gray-500">Nu există comenzi astăzi</p>
          ) : (
            <div className="space-y-2">
              {todayOrders.slice(0, 5).map((order) => {
                const client = clients.find((c) => c.id === order.clientId);
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium">
                        {client?.nume || "Client necunoscut"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items?.length || 0} produse
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {(order.totalWithVAT || 0).toFixed(2)} RON
                      </p>
                      <p className="text-sm text-gray-600">
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

  // Placeholder screens (minimal - full version in separate components)
  // Orders Agent Screen - COMPLET & OPTIMIZAT
  const OrdersAgentScreen = () => {
    const isDayClosed = dayStatus[selectedDate]?.productionExported || false;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [currentOrder, setCurrentOrder] = useState({
      paymentType: "immediate",
      dueDate: null,
      items: [],
    });

    const agentClients = clients.filter(
      (c) => c.agentId === currentUser.agentId,
    );

    useEffect(() => {
      if (selectedClient) {
        const existingOrder = orders.find(
          (o) => o.clientId === selectedClient.id && o.date === selectedDate,
        );

        if (existingOrder) {
          setCurrentOrder({
            paymentType: existingOrder.paymentType,
            dueDate: existingOrder.dueDate,
            items: existingOrder.items,
          });
        } else {
          setCurrentOrder({
            paymentType: "immediate",
            dueDate: null,
            items: [],
          });
        }
      }
    }, [selectedClient, selectedDate]);

    const updateQuantity = (productId, quantity) => {
      const product = products.find((p) => p.id === productId);
      const price = getClientProductPrice(selectedClient, product);

      setCurrentOrder((prev) => {
        const items = [...prev.items];
        const itemIndex = items.findIndex((i) => i.productId === productId);

        if (quantity > 0) {
          if (itemIndex >= 0) {
            items[itemIndex] = { productId, quantity, price };
          } else {
            items.push({ productId, quantity, price });
          }
        } else {
          if (itemIndex >= 0) {
            items.splice(itemIndex, 1);
          }
        }

        return { ...prev, items };
      });
    };

    const getQuantity = (productId) => {
      const item = currentOrder.items.find((i) => i.productId === productId);
      return item ? item.quantity : 0;
    };

    const calculateTotal = () => {
      return currentOrder.items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);
        const subtotal = item.quantity * item.price;
        const tva = subtotal * (product.cotaTVA / 100);
        return sum + subtotal + tva;
      }, 0);
    };

    const handleSaveOrder = async () => {
      if (isDayClosed) {
        showMessage(
          "⛔ Ziua este închisă!   Nu se mai pot adăuga comenzi.",
          "error",
        );
        return;
      }

      if (!selectedClient) {
        showMessage("Selectați un client! ", "error");
        return;
      }

      if (currentOrder.items.length === 0) {
        showMessage("Adăugați produse în comandă! ", "error");
        return;
      }

      let total = 0;
      let totalTVA = 0;

      currentOrder.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        const subtotal = item.quantity * item.price;
        const tva = subtotal * (product.cotaTVA / 100);
        total += subtotal;
        totalTVA += tva;
      });

      const newOrder = {
        id: `order-${Date.now()}-${selectedClient.id}`,
        date: selectedDate,
        clientId: selectedClient.id,
        agentId: currentUser.agentId,
        paymentType: currentOrder.paymentType,
        dueDate: currentOrder.dueDate,
        items: currentOrder.items,
        total,
        totalTVA,
        totalWithVAT: total + totalTVA,
        invoiceExported: false,
        receiptExported: false,
      };

      const otherOrders = orders.filter(
        (o) => !(o.date === selectedDate && o.clientId === selectedClient.id),
      );

      const allOrders = [...otherOrders, newOrder];

      // ✅ LOGICA:  Check dacă e prima comandă a acestei zile
      const ordersBeforeToday = orders.filter((o) => o.date === selectedDate);
      const isFirstOrderOfDay = ordersBeforeToday.length === 0;

      let updatedCompany = company;

      // ✅ Dacă e prima comandă a zilei ȘI e o zi nouă, incrementează LOT
      if (isFirstOrderOfDay) {
        const lastLotDate = company.lotDate;
        const today = selectedDate;

        // Verifică dacă LOT-ul e de ieri
        if (lastLotDate !== today) {
          updatedCompany = {
            ...company,
            lotNumberCurrent: company.lotNumberCurrent + 1,
            lotDate: today,
          };

          const companySaved = await saveData("company", updatedCompany);
          if (!companySaved) {
            showMessage("Eroare salvare LOT!", "error");
            return;
          }
          setCompany(updatedCompany);
          showMessage(
            `📦 LOT incrementat automat:  ${updatedCompany.lotNumberCurrent}`,
          );
        }
      }

      const success = await saveData("orders", allOrders);

      if (success) {
        setOrders(allOrders);
        showMessage("Comandă salvată cu succes!");
      }
    };

    const handleBack = () => {
      setSelectedClient(null);
      setCurrentOrder({
        paymentType: "immediate",
        dueDate: null,
        items: [],
      });
    };
    const getOrderStatus = () => {
      if (!selectedClient) return { isExported: false, isDisabled: false };

      const selectedOrder = orders.find(
        (o) => o.clientId === selectedClient.id && o.date === selectedDate,
      );

      const isExported = selectedOrder?.invoiceExported || false;
      const isDisabled = isDayClosed || isExported;

      return { isExported, isDisabled };
    };

    if (!selectedClient) {
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Comenzi - {currentUser.name}
              </h2>
              {isDayClosed && (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm font-semibold">
                  🔒 ZI ÎNCHISĂ
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
              />
            </div>
          </div>

          {isDayClosed && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold text-sm sm:text-base">
                ⚠️ Atenție: Ziua este închisă!
              </p>
              <p className="text-red-700 text-xs sm:text-sm mt-1">
                Producția pentru această zi a fost exportată. Nu se mai pot
                modifica comenzile.
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Selectați Client</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {agentClients.map((client) => {
                const clientOrder = orders.find(
                  (o) => o.clientId === client.id && o.date === selectedDate,
                );
                return (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    disabled={isDayClosed}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      clientOrder
                        ? "border-green-500 bg-green-50 hover:bg-green-100"
                        : "border-gray-200 hover:border-amber-500 hover:bg-amber-50"
                    } ${isDayClosed ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-sm sm:text-base">
                          {client.nume}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {
                            priceZones.find((z) => z.id === client.priceZone)
                              ?.name
                          }
                        </p>
                      </div>
                      {clientOrder && (
                        <span className="text-green-600 text-lg">✓</span>
                      )}
                    </div>
                    {clientOrder && (
                      <div className="mt-2 pt-2 border-t border-green-200">
                        <p className="text-xs text-gray-600">
                          {clientOrder.items?.length || 0} produse ·{" "}
                          {clientOrder.totalWithVAT?.toFixed(2)} RON
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
    const { isExported, isDisabled } = getOrderStatus();
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm: items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ← Înapoi
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {selectedClient.nume}
              </h2>
              {isExported && (
                <span className="text-green-600 font-semibold text-sm">
                  ✓ Exportat
                </span>
              )}
              {isDayClosed && !isExported && (
                <span className="text-red-600 font-semibold text-sm">
                  🔒 Închis
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={currentOrder.paymentType === "immediate"}
                  onChange={() =>
                    setCurrentOrder({
                      ...currentOrder,
                      paymentType: "immediate",
                      dueDate: null,
                    })
                  }
                  disabled={isDisabled}
                />
                💰 Plată la zi
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={currentOrder.paymentType === "credit"}
                  onChange={() =>
                    setCurrentOrder({ ...currentOrder, paymentType: "credit" })
                  }
                  disabled={isDisabled}
                />
                📄 Cu termen
              </label>
            </div>
            {currentOrder.paymentType === "credit" && (
              <input
                type="date"
                value={currentOrder.dueDate || ""}
                onChange={(e) =>
                  setCurrentOrder({ ...currentOrder, dueDate: e.target.value })
                }
                disabled={isDisabled}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            )}
          </div>
        </div>
        {isExported && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold text-sm">
              ✓ Factură exportată - nu se mai poate edita
            </p>
          </div>
        )}

        {isDayClosed && !isExported && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold text-sm sm:text-base">
              ⚠️ Atenție: Ziua este închisă!
            </p>
            <p className="text-red-700 text-xs sm:text-sm mt-1">
              Producția pentru această zi a fost exportată. Nu se mai pot
              modifica comenzile.
            </p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((product) => {
              const price = getClientProductPrice(selectedClient, product);
              const quantity = getQuantity(product.id);

              return (
                <div
                  key={product.id}
                  className={`border-2 rounded-lg p-3 ${
                    quantity > 0
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200"
                  }`}
                >
                  <p className="text-xs sm:text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                    {product.descriere}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    {price?.toFixed(2)} RON
                  </p>
                  <input
                    type="number"
                    min="0"
                    value={quantity || ""}
                    onChange={(e) =>
                      updateQuantity(product.id, parseInt(e.target.value) || 0)
                    }
                    disabled={isDayClosed}
                    className="w-full px-2 py-2 border border-gray-300 rounded text-center text-sm disabled:bg-gray-100"
                    placeholder="0"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Comandă</p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-600">
                {calculateTotal().toFixed(2)} RON
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentOrder.items.length} produse în comandă
              </p>
            </div>
            <button
              onClick={handleSaveOrder}
              disabled={isDisabled || currentOrder.items.length === 0}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg flex items-center justify-center gap-2 ${
                isDisabled || currentOrder.items.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-amber-600 text-white hover:bg-amber-700"
              }`}
            >
              <Save className="w-5 h-5" />
              <span>Salvează Comandă</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
  // Orders Matrix Screen - COMPLET & OPTIMIZAT
  const OrdersMatrixScreen = () => {
    const isDayClosed = dayStatus[selectedDate]?.productionExported || false;

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAgent, setSelectedAgent] = useState("all");
    const [matrixData, setMatrixData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const canEdit = !isDayClosed || currentUser.role === "admin";

    const isClientExported = (clientId) => {
      const clientOrder = orders.find(
        (o) => o.clientId === clientId && o.date === selectedDate,
      );
      return clientOrder?.invoiceExported || false;
    };

    useEffect(() => {
      const dateOrders = orders.filter((o) => o.date === selectedDate);
      const matrix = {};

      const agentClients =
        selectedAgent === "all"
          ? clients
          : clients.filter((c) => c.agentId === selectedAgent);

      agentClients.forEach((client) => {
        const order = dateOrders.find((o) => o.clientId === client.id);

        if (order) {
          matrix[client.id] = {
            paymentType: order.paymentType,
            dueDate: order.dueDate,
            quantities: {},
          };
          order.items.forEach((item) => {
            matrix[client.id].quantities[item.productId] = item.quantity;
          });
        } else {
          matrix[client.id] = {
            paymentType: "immediate",
            dueDate: null,
            quantities: {},
          };
        }
      });

      setMatrixData(matrix);
      setEditMode(false);
    }, [selectedDate, selectedAgent, orders, contracts]);

    const updateQuantity = (clientId, productId, quantity) => {
      setMatrixData((prev) => ({
        ...prev,
        [clientId]: {
          ...prev[clientId],
          quantities: {
            ...prev[clientId].quantities,
            [productId]: quantity,
          },
        },
      }));
    };

    const updatePaymentType = (clientId, paymentType) => {
      setMatrixData((prev) => ({
        ...prev,
        [clientId]: {
          ...prev[clientId],
          paymentType,
          dueDate: paymentType === "credit" ? prev[clientId].dueDate : null,
        },
      }));
    };

    const updateDueDate = (clientId, dueDate) => {
      setMatrixData((prev) => ({
        ...prev,
        [clientId]: {
          ...prev[clientId],
          dueDate,
        },
      }));
    };

    const calculateClientTotal = (clientId) => {
      const client = clients.find((c) => c.id === clientId);
      const data = matrixData[clientId];
      if (!data || !data.quantities) return 0;

      let total = 0;
      Object.entries(data.quantities).forEach(([productId, quantity]) => {
        if (quantity > 0) {
          const product = products.find((p) => p.id === productId);
          const price = getClientProductPrice(client, product);
          const subtotal = quantity * price;
          const tva = subtotal * (product.cotaTVA / 100);
          total += subtotal + tva;
        }
      });

      return total;
    };

    const calculateProductTotal = (productId) => {
      let total = 0;
      Object.values(matrixData).forEach((data) => {
        total += data.quantities[productId] || 0;
      });
      return total;
    };

    const handleSaveMatrix = async () => {
      const newOrders = [];

      Object.entries(matrixData).forEach(([clientId, data]) => {
        const hasItems = Object.values(data.quantities).some((q) => q > 0);

        if (hasItems) {
          const client = clients.find((c) => c.id === clientId);
          const items = [];
          let total = 0;
          let totalTVA = 0;

          Object.entries(data.quantities).forEach(([productId, quantity]) => {
            if (quantity > 0) {
              const product = products.find((p) => p.id === productId);
              const price = getClientProductPrice(client, product);
              const subtotal = quantity * price;
              const tva = subtotal * (product.cotaTVA / 100);

              items.push({ productId, quantity, price });
              total += subtotal;
              totalTVA += tva;
            }
          });

          newOrders.push({
            id: `order-${Date.now()}-${clientId}`,
            date: selectedDate,
            clientId,
            agentId: client.agentId,
            paymentType: data.paymentType,
            dueDate: data.dueDate,
            items,
            total,
            totalTVA,
            totalWithVAT: total + totalTVA,
            invoiceExported: false,
            receiptExported: false,
          });
        }
      });

      const agentIds =
        selectedAgent === "all" ? agents.map((a) => a.id) : [selectedAgent];

      const otherOrders = orders.filter(
        (o) => !(o.date === selectedDate && agentIds.includes(o.agentId)),
      );

      const allOrders = [...otherOrders, ...newOrders];
      const success = await saveData("orders", allOrders);

      if (success) {
        setOrders(allOrders);
        setEditMode(false);
        showMessage(`Salvate ${newOrders.length} comenzi cu succes!`);
      }
    };

    const handleUnlockDay = async () => {
      if (
        !confirm(
          "Sigur doriți să deschideți din nou această zi?  Aceasta va permite editarea comenzilor.",
        )
      ) {
        return;
      }

      const updatedDayStatus = { ...dayStatus };
      if (updatedDayStatus[selectedDate]) {
        updatedDayStatus[selectedDate] = {
          ...updatedDayStatus[selectedDate],
          productionExported: false,
          unlockedBy: currentUser.name,
          unlockedAt: new Date().toISOString(),
        };
      }

      const success = await saveData("dayStatus", updatedDayStatus);
      if (success) {
        setDayStatus(updatedDayStatus);
        showMessage("Ziua a fost deschisă pentru editare!");
      }
    };

    const agentClients =
      selectedAgent === "all"
        ? clients
        : clients.filter((c) => c.agentId === selectedAgent);

    const totalValue = agentClients.reduce(
      (sum, c) => sum + calculateClientTotal(c.id),
      0,
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Matrice Comenzi
            </h2>
            {isDayClosed && (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                  🔒 ZI ÎNCHISĂ
                </span>
                {currentUser.role === "admin" && (
                  <button
                    onClick={handleUnlockDay}
                    className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold hover:bg-orange-200 transition"
                  >
                    🔓 Deschide Ziua
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">Toți Agenții</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            {editMode ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveMatrix}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm transition"
                >
                  <Save className="w-4 h-4" />
                  Salvează
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    const dateOrders = orders.filter(
                      (o) => o.date === selectedDate,
                    );
                    const matrix = {};
                    agentClients.forEach((client) => {
                      const order = dateOrders.find(
                        (o) => o.clientId === client.id,
                      );
                      if (order) {
                        matrix[client.id] = {
                          paymentType: order.paymentType,
                          dueDate: order.dueDate,
                          quantities: {},
                        };
                        order.items.forEach((item) => {
                          matrix[client.id].quantities[item.productId] =
                            item.quantity;
                        });
                      } else {
                        matrix[client.id] = {
                          paymentType: "immediate",
                          dueDate: null,
                          quantities: {},
                        };
                      }
                    });
                    setMatrixData(matrix);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm transition"
                >
                  Anulează
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!canEdit) {
                    showMessage(
                      "Ziua este închisă!  Doar administratorul poate deschide ziua. ",
                      "error",
                    );
                    return;
                  }
                  setEditMode(true);
                }}
                disabled={!canEdit}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition ${
                  canEdit
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Edit2 className="w-4 h-4" />
                {canEdit ? "Editează" : "Blocat"}
              </button>
            )}
          </div>
        </div>

        {isDayClosed && currentUser.role !== "admin" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold">
              ⚠️ Atenție: Ziua este închisă!
            </p>
            <p className="text-red-700 text-sm mt-1">
              Producția pentru această zi a fost exportată. Nu se mai pot face
              modificări. Contactați administratorul pentru a deschide ziua.
            </p>
          </div>
        )}
        {isDayClosed && currentUser.role === "admin" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold">
              ⚠️ Atenție: Ziua este închisă!
            </p>
            <p className="text-red-700 text-sm mt-1">
              Producția pentru această zi a fost exportată. Tabelul este vizibil
              dar input-urile sunt dezactivate. Folosiți butonul "🔓 Deschide
              Ziua" pentru a relua editarea.
            </p>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold sticky left-0 bg-gray-50 z-10">
                  Client
                </th>
                <th className="px-3 py-2 text-center font-semibold">Plată</th>
                <th className="px-3 py-2 text-right font-semibold min-w-[100px]">
                  Total
                </th>
                {products.map((p) => (
                  <th
                    key={p.id}
                    className="px-3 py-3 text-center font-semibold"
                    style={{ minWidth: "80px" }}
                  >
                    <div
                      style={{
                        height: "140px",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        paddingBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                          transform: "rotate(180deg)",
                          fontSize: "12px",
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                        }}
                      >
                        {p.descriere}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#666",
                        fontWeight: "normal",
                        marginTop: "4px",
                      }}
                    >
                      {p.um}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agentClients.map((client) => {
                const data = matrixData[client.id];
                const total = calculateClientTotal(client.id);
                const isExported = isClientExported(client.id);

                return (
                  <tr
                    key={client.id}
                    className={`border-t border-gray-200 hover:bg-gray-50 ${
                      isExported ? "bg-green-50" : ""
                    }`}
                  >
                    <td
                      className={`px-3 py-2 font-medium sticky left-0 z-10 ${
                        isExported ? "bg-green-50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-semibold text-sm">
                            {client.nume}
                          </div>
                          <div className="text-xs text-gray-500">
                            {
                              priceZones.find((z) => z.id === client.priceZone)
                                ?.name
                            }
                          </div>
                        </div>
                        {isExported && (
                          <span className="text-green-600 font-bold text-sm">
                            ✓
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {editMode && !isExported ? (
                        <div className="flex flex-col gap-1 items-center">
                          <select
                            value={data?.paymentType || "immediate"}
                            onChange={(e) =>
                              updatePaymentType(client.id, e.target.value)
                            }
                            disabled={isExported}
                            className="px-2 py-1 border border-gray-300 rounded text-xs w-16 disabled:bg-gray-100"
                          >
                            <option value="immediate">💰</option>
                            <option value="credit">📄</option>
                          </select>
                          {data?.paymentType === "credit" && (
                            <input
                              type="date"
                              value={data.dueDate || ""}
                              onChange={(e) =>
                                updateDueDate(client.id, e.target.value)
                              }
                              className="px-2 py-1 border border-gray-300 rounded text-xs w-24"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-sm">
                          {data?.paymentType === "immediate"
                            ? "💰"
                            : data?.paymentType === "credit"
                              ? "📄"
                              : "-"}
                          {data?.paymentType === "credit" && data?.dueDate && (
                            <div className="text-xs text-gray-500">
                              {data.dueDate}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-sm">
                      {total > 0 ? total.toFixed(2) : "-"}
                    </td>
                    {products.map((p) => {
                      const price = getClientProductPrice(client, p);
                      return (
                        <td key={p.id} className="px-2 py-2 text-center">
                          {editMode && !isExported ? (
                            <div className="flex flex-col items-center gap-1">
                              <input
                                type="number"
                                min="0"
                                value={data?.quantities[p.id] || ""}
                                onChange={(e) =>
                                  updateQuantity(
                                    client.id,
                                    p.id,
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                disabled={isExported}
                                className="w-12 px-1 py-1 border border-gray-300 rounded text-center text-xs disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="0"
                              />
                              <div className="text-xs text-gray-400">
                                {price?.toFixed(2)}
                              </div>
                            </div>
                          ) : (
                            <div className="font-medium text-sm">
                              {data?.quantities[p.id] || "-"}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr className="border-t-2 border-gray-400 font-bold bg-amber-50">
                <td className="px-3 py-2 sticky left-0 bg-amber-50 z-10 font-semibold">
                  TOTAL
                </td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2 text-right text-sm">
                  {totalValue.toFixed(2)}
                </td>
                {products.map((p) => (
                  <td
                    key={p.id}
                    className="px-2 py-2 text-center font-semibold text-sm"
                  >
                    {calculateProductTotal(p.id) || "-"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Clienți Afișați</p>
            <p className="text-2xl font-bold text-gray-800">
              {agentClients.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Comenzi Active</p>
            <p className="text-2xl font-bold text-blue-600">
              {
                Object.values(matrixData).filter((d) =>
                  Object.values(d.quantities).some((q) => q > 0),
                ).length
              }
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Plată la zi</p>
            <p className="text-2xl font-bold text-amber-600">
              {
                Object.values(matrixData).filter(
                  (d) =>
                    d.paymentType === "immediate" &&
                    Object.values(d.quantities).some((q) => q > 0),
                ).length
              }
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Cu termen</p>
            <p className="text-2xl font-bold text-orange-600">
              {
                Object.values(matrixData).filter(
                  (d) =>
                    d.paymentType === "credit" &&
                    Object.values(d.quantities).some((q) => q > 0),
                ).length
              }
            </p>
          </div>
        </div>
      </div>
    );
  };
  const ReportsScreen = () => (
    <div className="text-2xl font-bold">📈 Rapoarte - În dezvoltare</div>
  );
  const ExportScreen = ({ dayStatus, setDayStatus }) => {
    const [selectedDate, setSelectedDate] = useState(
      new Date().toISOString().split("T")[0],
    );
    const [exportMode, setExportMode] = useState("toExport"); // 'toExport' sau 'all'
    const [exportCount, setExportCount] = useState({});

    useEffect(() => {
      const saved = localStorage.getItem("exportCount");
      if (saved) setExportCount(JSON.parse(saved));
    }, []);

    const ordersForDate = orders.filter((o) => o.date === selectedDate);
    const invoiceOrders = ordersForDate.filter((o) => !o.invoiceExported);
    const receiptOrders = ordersForDate.filter((o) => !o.receiptExported);

    const totalOrders = ordersForDate.length;
    const totalInvoices = invoiceOrders.length;
    const totalReceipts = receiptOrders.length;

    const isDayClosed = dayStatus[selectedDate]?.productionExported || false;

    // ✅ Generare XML Facturi
    const generateInvoicesXML = () => {
      if (invoiceOrders.length === 0) {
        showMessage(
          "Nu sunt facturi neexportate pentru această dată! ",
          "error",
        );
        return;
      }

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Facturi>\n';

      let invoiceNumber = 28; // Start from 28 based on example
      invoiceOrders.forEach((order) => {
        const client = clients.find((c) => c.id === order.clientId);

        xml += "  <Factura>\n";
        xml += "    <Antet>\n";
        xml += `      <FurnizorNume>${company.furnizorNume}</FurnizorNume>\n`;
        xml += `      <FurnizorCIF>${company.furnizorCIF}</FurnizorCIF>\n`;
        xml += `      <FurnizorNrRegCom>${company.furnizorNrRegCom}</FurnizorNrRegCom>\n`;
        xml += `      <FurnizorCapital>0.00</FurnizorCapital>\n`;
        xml += `      <FurnizorAdresa>${company.furnizorStrada}</FurnizorAdresa>\n`;
        xml += `      <FurnizorBanca>${company.banca || ""}</FurnizorBanca>\n`;
        xml += `      <FurnizorIBAN>${company.iban || ""}</FurnizorIBAN>\n`;
        xml += `      <FurnizorInformatiiSuplimentare></FurnizorInformatiiSuplimentare>\n`;
        xml += `      <ClientNume>${client.nume}</ClientNume>\n`;
        xml += `      <ClientInformatiiSuplimentare></ClientInformatiiSuplimentare>\n`;
        xml += `      <ClientCIF>${client.cif}</ClientCIF>\n`;
        xml += `      <ClientNrRegCom>${client.nrRegCom}</ClientNrRegCom>\n`;
        xml += `      <ClientJudet>${client.judet}</ClientJudet>\n`;
        xml += `      <ClientLocalitate>${client.localitate}</ClientLocalitate>\n`;
        xml += `      <ClientTara>RO</ClientTara>\n`;
        xml += `      <ClientAdresa>${client.strada}</ClientAdresa>\n`;
        xml += `      <ClientTelefon></ClientTelefon>\n`;
        xml += `      <ClientEmail></ClientEmail>\n`;
        xml += `      <ClientBanca></ClientBanca>\n`;
        xml += `      <ClientIBAN></ClientIBAN>\n`;
        xml += `      <FacturaNumar>${invoiceNumber}</FacturaNumar>\n`;

        const [year, month, day] = selectedDate.split("-");
        xml += `      <FacturaData>${day}.${month}.${year}</FacturaData>\n`;
        xml += `      <FacturaScadenta>${day}.${month}.${year}</FacturaScadenta>\n`;
        xml += `      <FacturaTaxareInversa>Nu</FacturaTaxareInversa>\n`;
        xml += `      <FacturaTVAIncasare>Nu</FacturaTVAIncasare>\n`;
        xml += `      <FacturaInformatiiSuplimentare> </FacturaInformatiiSuplimentare>\n`;
        xml += `      <FacturaMoneda>RON</FacturaMoneda>\n`;
        xml += `      <FacturaCotaTVA>TVA (${order.items[0]?.productId ? products.find((p) => p.id === order.items[0].productId)?.cotaTVA : 21}%)</FacturaCotaTVA>\n`;
        xml += `      <FacturaGreutate>0.000</FacturaGreutate>\n`;
        xml += `      <FacturaAccize>0.00</FacturaAccize>\n`;
        xml += `      <FacturaIndexSPV></FacturaIndexSPV>\n`;
        xml += "    </Antet>\n";
        xml += "    <Detalii>\n";
        xml += "      <Continut>\n";

        let lineNumber = 1;
        order.items.forEach((item) => {
          const product = products.find((p) => p.id === item.productId);
          const valoare = (item.quantity * item.price).toFixed(2);
          const tva = (valoare * (product.cotaTVA / 100)).toFixed(2);

          xml += "        <Linie>\n";
          xml += `          <LinieNrCrt>${lineNumber}</LinieNrCrt>\n`;
          xml += `          <Descriere>${product.descriere}</Descriere>\n`;
          xml += `          <CodArticolFurnizor>${product.codArticolFurnizor} </CodArticolFurnizor>\n`;
          xml += `          <CodArticolClient></CodArticolClient>\n`;
          xml += `          <CodBare/>\n`;
          xml += `          <InformatiiSuplimentare>Lot:${company.lotNumberCurrent}</InformatiiSuplimentare>\n`;
          xml += `          <UM>${product.um}</UM>\n`;
          xml += `          <Cantitate>${item.quantity.toFixed(3)}</Cantitate>\n`;
          xml += `          <Pret>${item.price.toFixed(4)}</Pret>\n`;
          xml += `          <Valoare>${valoare}</Valoare>\n`;
          xml += `          <ProcTVA>${product.cotaTVA}</ProcTVA>\n`;
          xml += `          <TVA>${tva}</TVA>\n`;
          xml += "        </Linie>\n";
          lineNumber++;
          if (client.afiseazaKG && product.gramajKg > 0) {
            const cantitateKg = item.quantity * product.gramajKg;

            xml += "        <Linie>\n";
            xml += `          <LinieNrCrt>${lineNumber}</LinieNrCrt>\n`;
            xml += `          <Descriere>${product.descriere}</Descriere>\n`;
            xml += `          <CodArticolFurnizor>${product.codArticolFurnizor}</CodArticolFurnizor>\n`;
            xml += `          <InformatiiSuplimentare>Lot: ${company.lotNumberCurrent}</InformatiiSuplimentare>\n`;
            xml += `          <UM>KG</UM>\n`;
            xml += `          <Cantitate>${cantitateKg.toFixed(3)}</Cantitate>\n`;
            xml += `          <Pret>0.0000</Pret>\n`;
            xml += `          <Valoare>0.00</Valoare>\n`;
            xml += `          <ProcTVA>0</ProcTVA>\n`;
            xml += `          <TVA>0.00</TVA>\n`;
            xml += "        </Linie>\n";
            lineNumber++;
          }
        });

        xml += "      </Continut>\n";
        xml += "      <txtObservatii1></txtObservatii1>\n";
        xml += "    </Detalii>\n";
        xml += "    <Sumar>\n";
        xml += `      <TotalValoare>${order.total.toFixed(2)}</TotalValoare>\n`;
        xml += `      <TotalTVA>${order.totalTVA.toFixed(2)}</TotalTVA>\n`;
        xml += `      <Total>${order.totalWithVAT.toFixed(2)}</Total>\n`;
        xml += `      <LinkPlata></LinkPlata>\n`;
        xml += "    </Sumar>\n";
        xml += "    <Observatii>\n";
        xml += "      <txtObservatii></txtObservatii>\n";
        xml += "      <SoldClient></SoldClient>\n";
        xml += "      <ModalitatePlata></ModalitatePlata>\n";
        xml += "    </Observatii>\n";
        xml += "  </Factura>\n";

        invoiceNumber++;
      });

      xml += "</Facturi>";
      return xml;
    };

    // ✅ Generare XML Chitanțe
    const generateReceiptsXML = () => {
      if (receiptOrders.length === 0) {
        showMessage(
          "Nu sunt chitanțe neexportate pentru această dată!",
          "error",
        );
        return;
      }

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Incasari>\n';

      let receiptNumber = 1;
      let invoiceNumber = 28;

      receiptOrders.forEach((order) => {
        const receiptCode = `CN${receiptNumber.toString().padStart(3, "0")}`;
        xml += "  <Linie>\n";

        const [year, month, day] = selectedDate.split("-");
        xml += `    <Data>${day}.${month}.${year}</Data>\n`;
        xml += `    <Numar>${receiptCode}</Numar>\n`;
        xml += `    <Suma>${order.totalWithVAT.toFixed(2)}</Suma>\n`;
        xml += `    <Cont>5311</Cont>\n`;

        const client = clients.find((c) => c.id === order.clientId);
        xml += `    <ContClient>${client.codContabil}</ContClient>\n`;
        xml += `    <FacturaNumar>${invoiceNumber}</FacturaNumar>\n`;
        xml += "  </Linie>\n";

        receiptNumber++;
        invoiceNumber++;
      });

      xml += "</Incasari>";
      return xml;
    };

    // ✅ Generare CSV Producție
    const generateProductionCSV = () => {
      let csv =
        "nr,data,den_gest,cod,denumire,lot,um,cantitate,pret,valoare,consumuri,comanda,explicatie\n";

      let lineNumber = 1;
      ordersForDate.forEach((order) => {
        order.items.forEach((item) => {
          const product = products.find((p) => p.id === item.productId);
          const gest = gestiuni.find((g) => g.id === product.gestiune);
          const valoare = (item.quantity * item.price).toFixed(2);

          csv += `${lineNumber},${selectedDate},${gest.name},${product.codArticolFurnizor},${product.descriere},${company.lotNumberCurrent},${product.um},${item.quantity},${item.price},${valoare},0,${order.id},\n`;
          lineNumber++;
        });
      });

      return csv;
    };

    // ✅ Download fișier
    const downloadFile = (content, filename) => {
      const element = document.createElement("a");
      const file = new Blob([content], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    // ✅ Export Facturi
    const handleExportInvoices = async () => {
      const xml = generateInvoicesXML();
      if (!xml) return;

      const [year, month, day] = selectedDate.split("-");
      const currentExport = (exportCount[selectedDate] || 0) + 1;
      const filename = `f_${company.furnizorCIF.replace("RO", "")}_${currentExport}_${day}-${month}-${year}.XML`;

      downloadFile(xml, filename);

      // ✅ Mark invoices as exported
      const updatedOrders = orders.map((o) =>
        o.date === selectedDate && invoiceOrders.find((io) => io.id === o.id)
          ? { ...o, invoiceExported: true }
          : o,
      );

      const success = await saveData("orders", updatedOrders);
      if (success) {
        setOrders(updatedOrders);
        const newCount = { ...exportCount, [selectedDate]: currentExport };
        setExportCount(newCount);
        localStorage.setItem("exportCount", JSON.stringify(newCount));
        showMessage(`✅ Facturi exportate:  ${filename}`);
      }
    };

    // ✅ Export Chitanțe
    const handleExportReceipts = async () => {
      const xml = generateReceiptsXML();
      if (!xml) return;

      const [year, month, day] = selectedDate.split("-");
      const currentExport = (exportCount[selectedDate] || 0) + 1;
      const filename = `I_${company.furnizorCIF.replace("RO", "")}_${currentExport}_${day}-${month}-${year}.XML`;

      downloadFile(xml, filename);

      // ✅ Mark receipts as exported
      const updatedOrders = orders.map((o) =>
        o.date === selectedDate && receiptOrders.find((ro) => ro.id === o.id)
          ? { ...o, receiptExported: true }
          : o,
      );

      const success = await saveData("orders", updatedOrders);
      if (success) {
        setOrders(updatedOrders);
        const newCount = { ...exportCount, [selectedDate]: currentExport };
        setExportCount(newCount);
        localStorage.setItem("exportCount", JSON.stringify(newCount));
        showMessage(`✅ Chitanțe exportate: ${filename}`);
      }
    };

    // ✅ Export Producție & Close Day
    const handleExportProduction = async () => {
      if (ordersForDate.length === 0) {
        showMessage("Nu sunt comenzi pentru a exporta producția!", "error");
        return;
      }

      const csv = generateProductionCSV();
      const [year, month, day] = selectedDate.split("-");
      const filename = `p_${company.furnizorCIF.replace("RO", "")}_${day}-${month}-${year}.CSV`;

      downloadFile(csv, filename);

      // ✅ Auto-close day
      const updatedDayStatus = {
        ...dayStatus,
        [selectedDate]: {
          productionExported: true,
          exportedAt: new Date().toISOString(),
          exportedBy: currentUser.name,
          lotNumber: company.lotNumberCurrent,
        },
      };

      const success = await saveData("dayStatus", updatedDayStatus);
      if (success) {
        setDayStatus(updatedDayStatus);
        showMessage(`✅ Producție exportată: ${filename} - ZI ÎNCHISĂ!  🔒`);
      }
    };

    // ✅ Redeschide ziua (admin only)
    const handleReopenDay = async () => {
      if (currentUser.role !== "admin") {
        showMessage("Doar admin poate redeschide ziua!", "error");
        return;
      }

      if (!confirm(`Sigur doriți să redeschideți ziua ${selectedDate}?`)) {
        return;
      }

      const updatedDayStatus = { ...dayStatus };
      delete updatedDayStatus[selectedDate];

      const success = await saveData("dayStatus", updatedDayStatus);
      if (success) {
        setDayStatus(updatedDayStatus);
        showMessage("✅ Ziua redeschisă pentru modificări!");
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Export Documente</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* MOD EXPORT */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">
            Mod Export
          </h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={exportMode === "toExport"}
                onChange={() => setExportMode("toExport")}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Doar Neexportate</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={exportMode === "all"}
                onChange={() => setExportMode("all")}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Toate</span>
            </label>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            Selectați ce comenzi să fie exportate
          </p>
        </div>

        {/* STATISTICI */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Total Comenzi</p>
            <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Facturi Neexportate</p>
            <p className="text-3xl font-bold text-blue-600">{totalInvoices}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Chitanțe Neexportate</p>
            <p className="text-3xl font-bold text-green-600">{totalReceipts}</p>
          </div>
          <div
            className={`bg-white p-4 rounded-lg shadow border-l-4 ${
              isDayClosed ? "border-red-500" : "border-gray-300"
            }`}
          >
            <p className="text-sm text-gray-600">Status Zi</p>
            <p
              className={`text-3xl font-bold ${
                isDayClosed ? "text-red-600" : "text-gray-600"
              }`}
            >
              {isDayClosed ? "🔒 Închisă" : "🟢 Deschisă"}
            </p>
          </div>
        </div>

        {/* EXPORT FACTURI */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">📄</span>
            <div>
              <h3 className="text-lg font-semibold">Export Facturi (XML)</h3>
              <p className="text-sm text-gray-600">
                {totalInvoices} facturi neexportate
              </p>
            </div>
          </div>
          <button
            onClick={handleExportInvoices}
            disabled={totalInvoices === 0}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center justify-center gap-2 font-medium"
          >
            <Download className="w-5 h-5" />
            Export Facturi
          </button>
        </div>

        {/* EXPORT CHITANȚE */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🧾</span>
            <div>
              <h3 className="text-lg font-semibold">Export Chitanțe (XML)</h3>
              <p className="text-sm text-gray-600">
                {totalReceipts} chitanțe neexportate
              </p>
            </div>
          </div>
          <button
            onClick={handleExportReceipts}
            disabled={totalReceipts === 0}
            className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition flex items-center justify-center gap-2 font-medium"
          >
            <Download className="w-5 h-5" />
            Export Chitanțe
          </button>
        </div>

        {/* EXPORT PRODUCȚIE */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">📊</span>
            <div>
              <h3 className="text-lg font-semibold">
                Export Fișă Producție (CSV)
              </h3>
              <p className="text-sm text-gray-600">
                Total {totalOrders} articole pentru producție
              </p>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
            <p className="text-sm text-orange-800">
              ⚠️ ATENȚIE: După export, ziua se va ÎNCHIDE și nu se va mai putea
              edita!
            </p>
          </div>
          <button
            onClick={handleExportProduction}
            disabled={ordersForDate.length === 0 || isDayClosed}
            className="w-full bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition flex items-center justify-center gap-2 font-medium"
          >
            <Download className="w-5 h-5" />
            Export Producție
          </button>
        </div>

        {/* REDESCHIDE ZI (admin) */}
        {isDayClosed && currentUser.role === "admin" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">
              🔓 Redeschide Ziua
            </h3>
            <p className="text-sm text-red-700 mb-4">
              Ziua {selectedDate} este închisă. Doar admin poate redeschide
              pentru modificări.
            </p>
            <button
              onClick={handleReopenDay}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-medium"
            >
              Redeschide Ziua
            </button>
          </div>
        )}
      </div>
    );
  };

  const ClientsScreen = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [localEditingClient, setLocalEditingClient] = useState(null);

    // ✅ SYNC cu editingClient când se schimbă
    useEffect(() => {
      setLocalEditingClient(editingClient);
    }, [editingClient]);

    const filteredClients = clients.filter(
      (c) =>
        c.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cif.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleAddClient = () => {
      const newClient = {
        id: `client-${Date.now()}`,
        nume: "",
        cif: "",
        nrRegCom: "",
        codContabil: `${(clients.length + 1).toString().padStart(5, "0")}`,
        judet: "",
        localitate: "",
        strada: "",
        codPostal: "",
        telefon: "",
        email: "",
        banca: "",
        iban: "",
        agentId: agents[0]?.id || "",
        priceZone: priceZones[0]?.id || "",
        afiseazaKG: false,
        productCodes: {},
      };
      setEditingClient(newClient);
      setLocalEditingClient(newClient);
    };

    const handleSaveClient = async () => {
      if (!localEditingClient.nume || !localEditingClient.cif) {
        showMessage("Completați denumirea și CUI!  ", "error");
        return;
      }

      try {
        const existingIndex = clients.findIndex(
          (c) => c.id === localEditingClient.id,
        );

        if (existingIndex >= 0) {
          // Update existing client
          await updateClient(localEditingClient.id, localEditingClient);
          const updatedClients = [...clients];
          updatedClients[existingIndex] = localEditingClient;
          setClients(updatedClients);
        } else {
          // Create new client
          await createClient(localEditingClient);
          setClients([...clients, localEditingClient]);
        }
        
        setEditingClient(null);
        setLocalEditingClient(null);
        showMessage("Client salvat cu succes!");
      } catch (error) {
        showMessage("Eroare la salvarea clientului!", "error");
        console.error(error);
      }
    };

    const handleDeleteClient = async (clientId) => {
      if (confirm("Sigur doriți să ștergeți acest client?")) {
        try {
          await deleteClient(clientId);
          const updatedClients = clients.filter((c) => c.id !== clientId);
          setClients(updatedClients);
          showMessage("Client șters cu succes!");
        } catch (error) {
          showMessage("Eroare la ștergerea clientului!", "error");
          console.error(error);
        }
      }
    };

    if (localEditingClient) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {clients.find((c) => c.id === localEditingClient.id)
                ? "Editare Client"
                : "Client Nou"}
            </h2>
            <button
              onClick={() => {
                setEditingClient(null);
                setLocalEditingClient(null);
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            {/* DATE IDENTIFICARE */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Date Identificare</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CUI/CIF *
                  </label>
                  <input
                    type="text"
                    value={localEditingClient.cif}
                    onChange={(e) =>
                      setLocalEditingClient({
                        ...localEditingClient,
                        cif: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus: ring-blue-500 focus: border-transparent"
                    placeholder="RO12345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nr. Reg. Com. / PFA *
                  </label>
                  <input
                    type="text"
                    value={localEditingClient.nrRegCom}
                    onChange={(e) =>
                      setLocalEditingClient({
                        ...localEditingClient,
                        nrRegCom: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="J25/123/2020"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Denumire *
                </label>
                <input
                  type="text"
                  value={localEditingClient.nume}
                  onChange={(e) =>
                    setLocalEditingClient({
                      ...localEditingClient,
                      nume: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="OLIMPOS SRL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cod Contabil *
                </label>
                <input
                  type="text"
                  value={localEditingClient.codContabil}
                  onChange={(e) =>
                    setLocalEditingClient({
                      ...localEditingClient,
                      codContabil: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="00001"
                />
              </div>
            </div>

            {/* ADRESA */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Adresă</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Județ
                  </label>
                  <input
                    type="text"
                    value={localEditingClient.judet}
                    onChange={(e) =>
                      setLocalEditingClient({
                        ...localEditingClient,
                        judet: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Covasna"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localitate
                  </label>
                  <input
                    type="text"
                    value={localEditingClient.localitate}
                    onChange={(e) =>
                      setLocalEditingClient({
                        ...localEditingClient,
                        localitate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus: ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Sfântu Gheorghe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Strada
                </label>
                <input
                  type="text"
                  value={localEditingClient.strada}
                  onChange={(e) =>
                    setLocalEditingClient({
                      ...localEditingClient,
                      strada: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus: ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Str. Principală nr. 10"
                />
              </div>
            </div>

            {/* CONFIGURARE VÂNZĂRI */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Configurare Vânzări
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agent
                  </label>
                  <select
                    value={localEditingClient.agentId}
                    onChange={(e) =>
                      setLocalEditingClient({
                        ...localEditingClient,
                        agentId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zonă Preț
                  </label>
                  <select
                    value={localEditingClient.priceZone}
                    onChange={(e) =>
                      setLocalEditingClient({
                        ...localEditingClient,
                        priceZone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {priceZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localEditingClient.afiseazaKG}
                  onChange={(e) =>
                    setLocalEditingClient({
                      ...localEditingClient,
                      afiseazaKG: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700">
                  Afișează cantități în KG pe factură
                </span>
              </label>
            </div>

            {/* BUTOANE */}
            <div className="border-t pt-6 flex gap-3">
              <button
                onClick={handleSaveClient}
                className="bg-amber-600 text-white px-8 py-2 rounded-lg hover:bg-amber-700 transition flex items-center gap-2 font-medium"
              >
                <Save className="w-5 h-5" />
                Salvează Client
              </button>
              <button
                onClick={() => {
                  setEditingClient(null);
                  setLocalEditingClient(null);
                }}
                className="bg-gray-300 text-gray-700 px-8 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Administrare Clienți
          </h2>
          <button
            onClick={handleAddClient}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Adaugă Client
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Caută client (nume sau CUI)..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Cod
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Denumire
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    CUI
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Nr. Reg.
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Agent
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Zonă
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => {
                  const agent = agents.find((a) => a.id === client.agentId);
                  const zone = priceZones.find(
                    (z) => z.id === client.priceZone,
                  );
                  return (
                    <tr
                      key={client.id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 text-sm font-medium">
                        {client.codContabil}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {client.nume}
                      </td>
                      <td className="px-4 py-3 text-sm">{client.cif}</td>
                      <td className="px-4 py-3 text-sm">{client.nrRegCom}</td>
                      <td className="px-4 py-3 text-sm">
                        {agent?.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">{zone?.name || "-"}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingClient(client);
                              setLocalEditingClient(client);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Editare"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client.id)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Ștergere"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredClients.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Nu au fost găsiți clienți
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ProductsScreen = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [localEditingProduct, setLocalEditingProduct] = useState(null);

    // ✅ SYNC cu editingProduct
    useEffect(() => {
      setLocalEditingProduct(editingProduct);
    }, [editingProduct]);

    const filteredProducts = products.filter(
      (p) =>
        p.descriere.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codArticolFurnizor.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleAddProduct = () => {
      const newProduct = {
        id: `product-${Date.now()}`,
        codArticolFurnizor: `${(products.length + 1).toString().padStart(8, "0")}`,
        codProductie: "",
        codBare: "",
        descriere: "",
        um: "BUC",
        gestiune: gestiuni[0]?.id || "",
        gramajKg: 0,
        cotaTVA: 11,
        prices: priceZones.reduce(
          (acc, zone) => ({ ...acc, [zone.id]: 0 }),
          {},
        ),
      };
      setEditingProduct(newProduct);
      setLocalEditingProduct(newProduct);
    };

    const handleSaveProduct = async () => {
      if (
        !localEditingProduct.descriere ||
        !localEditingProduct.codArticolFurnizor
      ) {
        showMessage("Completați denumirea și codul furnizor!", "error");
        return;
      }

      try {
        const existingIndex = products.findIndex(
          (p) => p.id === localEditingProduct.id,
        );

        if (existingIndex >= 0) {
          // Update existing product
          await updateProduct(localEditingProduct.id, localEditingProduct);
          const updatedProducts = [...products];
          updatedProducts[existingIndex] = localEditingProduct;
          setProducts(updatedProducts);
        } else {
          // Create new product
          await createProduct(localEditingProduct);
          setProducts([...products, localEditingProduct]);
        }

        setEditingProduct(null);
        setLocalEditingProduct(null);
        showMessage("Produs salvat cu succes!");
      } catch (error) {
        showMessage("Eroare la salvarea produsului!", "error");
        console.error(error);
      }
    };

    const handleDeleteProduct = async (productId) => {
      if (confirm("Sigur doriți să ștergeți acest produs?")) {
        try {
          await deleteProduct(productId);
          const updatedProducts = products.filter((p) => p.id !== productId);
          setProducts(updatedProducts);
          showMessage("Produs șters cu succes!");
        } catch (error) {
          showMessage("Eroare la ștergerea produsului!", "error");
          console.error(error);
        }
      }
    };

    if (localEditingProduct) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {products.find((p) => p.id === localEditingProduct.id)
                ? "Editare Produs"
                : "Produs Nou"}
            </h2>
            <button
              onClick={() => {
                setEditingProduct(null);
                setLocalEditingProduct(null);
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            {/* CODURI */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Coduri</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cod Furnizor *
                  </label>
                  <input
                    type="text"
                    value={localEditingProduct.codArticolFurnizor}
                    onChange={(e) =>
                      setLocalEditingProduct({
                        ...localEditingProduct,
                        codArticolFurnizor: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="00000001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cod Producție
                  </label>
                  <input
                    type="text"
                    value={localEditingProduct.codProductie}
                    onChange={(e) =>
                      setLocalEditingProduct({
                        ...localEditingProduct,
                        codProductie: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus: ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="684811825476"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cod Bare
                  </label>
                  <input
                    type="text"
                    value={localEditingProduct.codBare}
                    onChange={(e) =>
                      setLocalEditingProduct({
                        ...localEditingProduct,
                        codBare: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            {/* DESCRIERE */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Descriere</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Denumire *
                  </label>
                  <input
                    type="text"
                    value={localEditingProduct.descriere}
                    onChange={(e) =>
                      setLocalEditingProduct({
                        ...localEditingProduct,
                        descriere: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="PAINE FELIAT 1. 5 KG"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UM
                  </label>
                  <select
                    value={localEditingProduct.um}
                    onChange={(e) =>
                      setLocalEditingProduct({
                        ...localEditingProduct,
                        um: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus: ring-blue-500 focus: border-transparent"
                  >
                    <option value="BUC">BUC</option>
                    <option value="KG">KG</option>
                    <option value="L">L</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gestiune
                  </label>
                  <select
                    value={localEditingProduct.gestiune}
                    onChange={(e) =>
                      setLocalEditingProduct({
                        ...localEditingProduct,
                        gestiune: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {gestiuni.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* CARACTERISTICI */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Caracteristici</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gramaj (kg/bucată)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={localEditingProduct.gramajKg}
                    onChange={(e) =>
                      setLocalEditingProduct({
                        ...localEditingProduct,
                        gramajKg: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus: ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1.500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cotă TVA (%)
                  </label>
                  <select
                    value={localEditingProduct.cotaTVA}
                    onChange={(e) =>
                      setLocalEditingProduct({
                        ...localEditingProduct,
                        cotaTVA: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={11}>11% - Cota redusă</option>
                    <option value={21}>21% - Cota standard</option>
                    <option value={5}>5% - Cărți, ziare</option>
                    <option value={0}>0% - Scutit TVA</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PREȚURI PE ZONE */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Prețuri pe Zone (fără TVA)
              </h3>
              <div className="grid grid-cols-1 sm: grid-cols-3 gap-4">
                {priceZones.map((zone) => (
                  <div key={zone.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {zone.name}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={localEditingProduct.prices[zone.id] || 0}
                      onChange={(e) =>
                        setLocalEditingProduct({
                          ...localEditingProduct,
                          prices: {
                            ...localEditingProduct.prices,
                            [zone.id]: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="9.17"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* BUTOANE */}
            <div className="border-t pt-6 flex gap-3">
              <button
                onClick={handleSaveProduct}
                className="bg-amber-600 text-white px-8 py-2 rounded-lg hover:bg-amber-700 transition flex items-center gap-2 font-medium"
              >
                <Save className="w-5 h-5" />
                Salvează Produs
              </button>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setLocalEditingProduct(null);
                }}
                className="bg-gray-300 text-gray-700 px-8 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Administrare Produse
          </h2>
          <button
            onClick={handleAddProduct}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Adaugă Produs
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Caută produs..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Cod
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Denumire
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    UM
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Gestiune
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Gramaj
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    TVA
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Preț A
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const gest = gestiuni.find((g) => g.id === product.gestiune);
                  return (
                    <tr
                      key={product.id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-orange-600">
                        {product.codArticolFurnizor}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {product.descriere}
                      </td>
                      <td className="px-4 py-3 text-sm">{product.um}</td>
                      <td className="px-4 py-3 text-sm">{gest?.name}</td>
                      <td className="px-4 py-3 text-sm">
                        {product.gramajKg} kg
                      </td>
                      <td className="px-4 py-3 text-sm">{product.cotaTVA}%</td>
                      <td className="px-4 py-3 text-sm">
                        {product.prices["zona-a"]?.toFixed(2)} RON
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setLocalEditingProduct(product);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Editare"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Ștergere"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Nu au fost găsiți produse
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ConfigScreen = () => {
    const [localCompany, setLocalCompany] = useState(company);

    useEffect(() => {
      setLocalCompany(company);
    }, [company]);

    const handleSaveConfig = async () => {
      if (!localCompany.furnizorNume || !localCompany.furnizorCIF) {
        showMessage("Completați datele obligatorii!  ", "error");
        return;
      }

      const success = await saveData("company", localCompany);
      if (success) {
        setCompany(localCompany);
        showMessage("Configurare salvată cu succes!");
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Configurare Societate
        </h2>

        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          {/* DATE IDENTIFICARE */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Date Identificare</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CUI/CIF
                </label>
                <input
                  type="text"
                  value={localCompany.furnizorCIF}
                  onChange={(e) =>
                    setLocalCompany({
                      ...localCompany,
                      furnizorCIF: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus: ring-blue-500 focus: border-transparent"
                  placeholder="RO12345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nr. Reg. Com.
                </label>
                <input
                  type="text"
                  value={localCompany.furnizorNrRegCom}
                  onChange={(e) =>
                    setLocalCompany({
                      ...localCompany,
                      furnizorNrRegCom: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="J14/603/1993"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Denumire firmă
              </label>
              <input
                type="text"
                value={localCompany.furnizorNume}
                onChange={(e) =>
                  setLocalCompany({
                    ...localCompany,
                    furnizorNume: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SC PANIFICATIE SRL"
              />
            </div>

            <div className="grid grid-cols-1 sm: grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Județ
                </label>
                <input
                  type="text"
                  value={localCompany.furnizorJudet}
                  onChange={(e) =>
                    setLocalCompany({
                      ...localCompany,
                      furnizorJudet: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus: ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Covasna"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localitate
                </label>
                <input
                  type="text"
                  value={localCompany.furnizorLocalitate}
                  onChange={(e) =>
                    setLocalCompany({
                      ...localCompany,
                      furnizorLocalitate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus: ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sfântu Gheorghe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresă
              </label>
              <input
                type="text"
                value={localCompany.furnizorStrada}
                onChange={(e) =>
                  setLocalCompany({
                    ...localCompany,
                    furnizorStrada: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Str. Fabricii nr. 10"
              />
            </div>
          </div>

          {/* SERIE DOCUMENTE */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Serie Documente</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serie Facturi
                </label>
                <input
                  type="text"
                  value={localCompany.invoiceSeries}
                  onChange={(e) =>
                    setLocalCompany({
                      ...localCompany,
                      invoiceSeries: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus: ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="FAC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serie Chitanțe
                </label>
                <input
                  type="text"
                  value={localCompany.receiptSeries}
                  onChange={(e) =>
                    setLocalCompany({
                      ...localCompany,
                      receiptSeries: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CN"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Număr LOT curent
                </label>
                <input
                  type="number"
                  value={localCompany.lotNumberCurrent}
                  onChange={(e) =>
                    setLocalCompany({
                      ...localCompany,
                      lotNumberCurrent: parseInt(e.target.value) || 0,
                    })
                  }
                  disabled={currentUser.role !== "admin"}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                    currentUser.role === "admin"
                      ? "focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-text"
                      : "bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {currentUser.role === "admin"
                    ? "✏️ Doar admin poate edita LOT"
                    : "ℹ️ LOT se incrementează automat la prima comandă a zilei noi"}
                </p>
              </div>
            </div>

            {company.lotDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  ✅ Ultimul LOT: <strong>{company.lotNumberCurrent}</strong>{" "}
                  din <strong>{company.lotDate}</strong>
                </p>
              </div>
            )}
          </div>

          {/* BUTOANE */}
          <div className="border-t pt-6">
            <button
              onClick={handleSaveConfig}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition flex items-center gap-2 font-medium"
            >
              <Save className="w-5 h-5" />
              Salvează Configurare
            </button>
          </div>
        </div>

        {/* BACKUP & RESTORE */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            💾 Backup & Restore Date
          </h3>
          <p className="text-sm text-blue-800 mb-4">
            Exportați sau importați toată baza de date pentru transfer pe alt
            calculator.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* EXPORT */}
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Export Date
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                Descarcă toată baza de date ca fișier JSON pentru backup sau
                transfer.
              </p>
              <button
                onClick={() => {
                  const allData = {
                    company,
                    gestiuni,
                    agents,
                    priceZones,
                    products,
                    clients,
                    contracts,
                    orders,
                    dayStatus,
                  };

                  const json = JSON.stringify(allData, null, 2);
                  const blob = new Blob([json], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `backup-${new Date().toISOString().split("T")[0]}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  showMessage("✅ Date exportate cu succes!");
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" />
                Descarcă Backup
              </button>
            </div>

            {/* IMPORT */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                Import Date
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                Încarcă un fișier JSON backup pentru a restaura toată baza de
                date.
              </p>
              <label className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-medium cursor-pointer">
                <Download className="w-4 h-4" />
                Selectează Fișier
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = async (event) => {
                      try {
                        const text = event.target?.result;
                        const data = JSON.parse(text);

                        // Validare
                        if (!data.company || !data.clients || !data.products) {
                          showMessage(
                            "❌ Fișierul nu are structura corectă!",
                            "error",
                          );
                          return;
                        }

                        // Salvează tot
                        await Promise.all([
                          saveData("company", data.company),
                          saveData("gestiuni", data.gestiuni || []),
                          saveData("agents", data.agents || []),
                          saveData("priceZones", data.priceZones || []),
                          saveData("products", data.products),
                          saveData("clients", data.clients),
                          saveData("contracts", data.contracts || []),
                          saveData("orders", data.orders || []),
                          saveData("dayStatus", data.dayStatus || {}),
                        ]);

                        // Sync clients and products to API
                        await syncClientsToAPI(data.clients);
                        await syncProductsToAPI(data.products);

                        // Reîncarcă
                        await loadAllData();

                        showMessage(
                          "✅ Date importate cu succes! Pagina se va reîncărca...",
                        );
                        setTimeout(() => window.location.reload(), 1500);
                      } catch (error) {
                        showMessage("❌ Eroare la import", "error");
                      }
                    };
                    reader.readAsText(file);
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
            <p className="text-xs text-orange-800">
              ⚠️ <strong>ATENȚIE:</strong> Importul va suprascrie TOATE datele
              curente! Asigurați-vă că ați făcut backup înainte.
            </p>
          </div>
        </div>

        {/* INFO PANEL */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">
            ℹ️ Informații LOT
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              ✅ LOT-ul se incrementează **automat** la prima comandă a zilei
              noi
            </li>
            <li>📦 Ziua anterioară ≠ Ziua curentă = incrementare</li>
            <li>🔒 Câmpul LOT e **read-only** și nu poate fi editat manual</li>
            <li>
              ⚠️ Dacă se fac corecții și se devalideaza ziua, LOT rămâne
              neschimbat
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const ContractsScreen = () => {
    const [editingContract, setEditingContract] = useState(null);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [contractPrices, setContractPrices] = useState({});

    const handleAddContract = () => {
      setSelectedClientId("");
      setContractPrices(
        products.reduce((acc, p) => {
          const selectedClient = clients.find((c) => c.id === selectedClientId);
          const defaultPrice = selectedClient
            ? p.prices[selectedClient.priceZone]
            : 0;
          return { ...acc, [p.id]: defaultPrice };
        }, {}),
      );
      setEditingContract({
        id: `contract-${Date.now()}`,
        clientId: "",
        clientName: "",
        createdAt: new Date().toISOString(),
        prices: {},
      });
    };

    const handleClientSelect = (clientId) => {
      const client = clients.find((c) => c.id === clientId);
      setSelectedClientId(clientId);

      // Auto-fill prețuri cu preț default din zona clientului
      const prices = products.reduce((acc, p) => {
        acc[p.id] = p.prices[client.priceZone] || 0;
        return acc;
      }, {});

      setContractPrices(prices);
      setEditingContract({
        id: `contract-${Date.now()}`,
        clientId: clientId,
        clientName: client.nume,
        createdAt: new Date().toISOString(),
        prices: prices,
      });
    };

    const handlePriceChange = (productId, price) => {
      setContractPrices((prev) => ({
        ...prev,
        [productId]: parseFloat(price) || 0,
      }));
      setEditingContract((prev) => ({
        ...prev,
        prices: {
          ...prev.prices,
          [productId]: parseFloat(price) || 0,
        },
      }));
    };

    const handleSaveContract = async () => {
      if (!editingContract.clientId) {
        showMessage("Selectați un client!", "error");
        return;
      }

      const updatedClients = clients.map((c) =>
        c.id === editingContract.clientId
          ? { ...c, contractId: editingContract.id }
          : c,
      );

      const updatedContracts = contracts.filter(
        (c) => c.id !== editingContract.id,
      );
      updatedContracts.push(editingContract);

      const successContracts = await saveData("contracts", updatedContracts);
      const successClients = await saveData("clients", updatedClients);

      // Sync the updated client to API
      const clientToUpdate = updatedClients.find(c => c.id === editingContract.clientId);
      if (clientToUpdate) {
        try {
          await updateClient(clientToUpdate.id, clientToUpdate);
        } catch (error) {
          console.error('Error syncing client to API:', error);
        }
      }

      if (successContracts && successClients) {
        setContracts(updatedContracts);
        setClients(updatedClients); // ← ADAUGĂ ASTA!
        setEditingContract(null);
        setSelectedClientId("");
        setContractPrices({});
        showMessage("Contract salvat cu succes!");
      }
    };

    const handleDeleteContract = async (contractId) => {
      if (confirm("Sigur doriți să ștergeți acest contract?")) {
        const updatedContracts = contracts.filter((c) => c.id !== contractId);

        // Șterge referința de contract din clienți
        const updatedClients = clients.map((c) =>
          c.contractId === contractId ? { ...c, contractId: null } : c,
        );

        const successContracts = await saveData("contracts", updatedContracts);
        const successClients = await saveData("clients", updatedClients);

        // Sync the updated clients to API
        for (const client of updatedClients) {
          if (clients.find(c => c.id === client.id)?.contractId === contractId) {
            try {
              await updateClient(client.id, client);
            } catch (error) {
              console.error('Error syncing client to API:', error);
            }
          }
        }

        if (successContracts && successClients) {
          setContracts(updatedContracts);
          setClients(updatedClients);
          showMessage("Contract și referințe șterse cu succes!");
        }
      }
    };

    const getAvailableClients = () => {
      // Clienți care NU au contract alocat (dar pot selecta dacă e edit)
      return clients.filter(
        (c) => !c.contractId || c.id === editingContract?.clientId,
      );
    };
    useEffect(() => {
      if (editingContract && editingContract.clientId) {
        setContractPrices(editingContract.prices || {});
      }
    }, [editingContract]);
    if (editingContract) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {contracts.find((c) => c.id === editingContract.id)
                ? "Editare Contract"
                : "Contract Nou"}
            </h2>
            <button
              onClick={() => {
                setEditingContract(null);
                setSelectedClientId("");
                setContractPrices({});
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            {/* SELECTARE CLIENT */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Selectare Client</h3>
              {editingContract &&
              contracts.find((c) => c.id === editingContract.id) ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">{editingContract.clientName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ℹ️ Client-ul nu poate fi schimbat pentru contracte existente
                  </p>
                </div>
              ) : (
                <select
                  value={selectedClientId}
                  onChange={(e) => handleClientSelect(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Selectați client --</option>
                  {getAvailableClients().map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nume}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* PREȚURI PRODUSE */}
            {editingContract.clientId && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Prețuri Contract (fără TVA)
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">
                          Produs
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Preț Zonă Default
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Preț Contract
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => {
                        const client = clients.find(
                          (c) => c.id === editingContract.clientId,
                        );
                        const defaultPrice = product.prices[client.priceZone];
                        const contractPrice =
                          contractPrices[product.id] || defaultPrice;

                        return (
                          <tr
                            key={product.id}
                            className="border-t border-gray-200"
                          >
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium">
                                  {product.descriere}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {product.um}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="text-gray-600">
                                {defaultPrice.toFixed(2)} RON
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                step="0.01"
                                value={contractPrice}
                                onChange={(e) =>
                                  handlePriceChange(product.id, e.target.value)
                                }
                                className={`w-20 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 transition ${
                                  contractPrice === defaultPrice
                                    ? "bg-gray-100 text-gray-500 border-gray-300"
                                    : "bg-white text-gray-900 border-amber-400"
                                }`}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 Prețurile auto-completate cu prețul din zona clientului.
                    Modificați după dorință.
                  </p>
                </div>
              </div>
            )}

            {/* BUTOANE */}
            <div className="border-t pt-6 flex gap-3">
              <button
                onClick={handleSaveContract}
                disabled={!editingContract.clientId}
                className="bg-amber-600 text-white px-8 py-2 rounded-lg hover:bg-amber-700 disabled:bg-gray-400 transition flex items-center gap-2 font-medium"
              >
                <Save className="w-5 h-5" />
                Salvează Contract
              </button>
              <button
                onClick={() => {
                  setEditingContract(null);
                  setSelectedClientId("");
                  setContractPrices({});
                }}
                className="bg-gray-300 text-gray-700 px-8 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Administrare Contracte
          </h2>
          <button
            onClick={handleAddContract}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Adaugă Contract
          </button>
        </div>

        {contracts.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            <p className="text-lg mb-2">📋 Nu există contracte</p>
            <p className="text-sm">
              Creați contracte pentru clienți cu oferte personalizate
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contracts.map((contract) => {
              const client = clients.find((c) => c.id === contract.clientId);
              return (
                <div
                  key={contract.id}
                  className="bg-white p-4 rounded-lg shadow border-l-4 border-amber-500"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {client?.nume || "Client Necunoscut"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(contract.createdAt).toLocaleDateString(
                          "ro-RO",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded mb-3">
                    <p className="text-sm text-gray-700">
                      <strong>{Object.keys(contract.prices).length}</strong>{" "}
                      produse cu prețuri personalizate
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingContract(contract);
                        setContractPrices(contract.prices || {});
                        setSelectedClientId(contract.clientId);
                      }}
                      className="flex-1 text-blue-600 hover:text-blue-800 px-3 py-2 border border-blue-300 rounded transition flex items-center justify-center gap-1 text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editare
                    </button>
                    <button
                      onClick={() => handleDeleteContract(contract.id)}
                      className="flex-1 text-red-600 hover:text-red-800 px-3 py-2 border border-red-300 rounded transition flex items-center justify-center gap-1 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Șterge
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const getClientProductPrice = (client, product) => {
    // Dacă client are contract, preț din contract
    if (client.contractId) {
      const contract = contracts.find((c) => c.id === client.contractId);
      return contract?.prices[product.id] || product.prices[client.priceZone];
    }
    // Altfel, preț din zonă
    return product.prices[client.priceZone];
  };

  // Render content
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "clients":
        return <ClientsScreen />;
      case "products":
        return <ProductsScreen />;
      case "contracts":
        return <ContractsScreen />;
      case "config":
        return <ConfigScreen />;
      case "orders-agent":
        return <OrdersAgentScreen />;
      case "orders-matrix":
        return <OrdersMatrixScreen />;
      case "reports":
        return <ReportsScreen />;
      case "export":
        return (
          <ExportScreen dayStatus={dayStatus} setDayStatus={setDayStatus} />
        );
      default:
        return <Dashboard />;
    }
  };

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Navigation />
        <div className="flex-1 p-6">
          {message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : message.type === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {message.text}
            </div>
          )}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
