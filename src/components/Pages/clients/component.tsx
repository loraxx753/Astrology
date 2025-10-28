import React, { useState } from 'react';
import { useClients, Client } from '@/lib/hooks/useClients';
import { useNavigate } from 'react-router-dom';
import { usePageBackground, pageBackgrounds } from '@/lib/hooks/usePageBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card';
import { Button } from "@/components/ThirdParty/ShadCn/Button";
import { PageComponentType } from '@/lib/types';

const ClientsPage: PageComponentType = () => {
  usePageBackground(pageBackgrounds.cosmic);
  // const { clients, loading, error, saveClient, editClient, deleteClient, reload } = useClients();
  const { clients, loading, error, editClient, deleteClient, reload } = useClients();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const navigate = useNavigate();

  const handleEdit = (client: Client) => {
    setEditingId(client.id!);
    setEditName(client.name);
  };

  const handleEditSave = async () => {
    if (editingId && editName.trim()) {
      await editClient(editingId, { name: editName });
      setEditingId(null);
      setEditName('');
      reload();
    }
  };

  const handleDelete = async (id: number) => {
    await deleteClient(id);
    reload();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading clients...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">Error: {error}</div>;
  return (
    <div className="min-h-screen" style={{ width: '100vw' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ margin: '0 auto' }}>
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-6 lg:p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
              Clients
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Manage your astrology clients, view their saved readings, and quickly access their charts.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button size="lg" asChild>
                <a href="/reading">Get Chart</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/">Home</a>
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-800">Client List</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-200">
                  {clients.length === 0 ? (
                    <li className="py-4 text-center text-gray-500">No clients found. Add a reading to save a client.</li>
                  ) : (
                    clients.map((client: Client) => (
                      <li key={client.id} className="flex items-center py-2">
                        {editingId === client.id ? (
                          <>
                            <input
                              className="border px-2 py-1 mr-2 rounded"
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                            />
                            <Button size="sm" className="bg-green-500 text-white px-2 py-1 mr-2" onClick={handleEditSave}>Save</Button>
                            <Button size="sm" variant="outline" className="px-2 py-1" onClick={() => setEditingId(null)}>Cancel</Button>
                          </>
                        ) : (
                          <div className="flex items-center w-full">
                            <Button
                              size="sm"
                              variant="link"
                              className="text-blue-600 font-medium mr-2 hover:underline px-0"
                              onClick={() => {
                                const params = new URLSearchParams();
                                Object.entries(client).forEach(([key, value]) => {
                                  if (key !== 'id' && value !== undefined && value !== null) {
                                    params.append(key, String(value));
                                  }
                                });
                                navigate(`/reading?${params.toString()}`);
                              }}
                            >
                              {client.name}
                            </Button>
                            <Button size="sm" variant="outline" className="bg-yellow-500 text-white px-2 py-1 mr-2" onClick={() => handleEdit(client)}>Edit</Button>
                            <Button size="sm" variant="outline" className="bg-red-500 text-white px-2 py-1" onClick={() => handleDelete(client.id!)}>Delete</Button>
                          </div>
                        )}
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-indigo-800">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-indigo-700">
                  Clients are saved automatically when you generate a reading. You can edit their name, view their chart, or delete them at any time. All data is stored locally in your browser for privacy.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

ClientsPage.path = "/clients";

export default ClientsPage;
