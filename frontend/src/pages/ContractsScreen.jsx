import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

const ContractsScreen = ({
  clients,
  setClients,
  products,
  contracts,
  setContracts,
  showMessage,
  saveData,
  updateClient,
}) => {
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

export default ContractsScreen;
