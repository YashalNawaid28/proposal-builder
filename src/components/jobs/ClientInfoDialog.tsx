"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewClientForm } from "@/components/jobs/NewClientForm";

interface ClientInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  clientData: any;
  setClientData: (data: any) => void;
}

export const ClientInfoDialog = ({
  isOpen,
  onClose,
  onComplete,
  clientData,
  setClientData,
}: ClientInfoDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [showClientForm, setShowClientForm] = useState(false);

  const clients = [
    { id: "1", name: "Customer 1" },
    { id: "2", name: "Customer 2" },
    { id: "3", name: "Customer 3" },
  ];

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setClientData({ ...clientData, clientName: client.name });
    }
  };

  const handleAddNewClient = () => {
    setShowClientForm(true);
  };

  const handleNewClientSubmit = (newClientData: any) => {
    setClientData({ ...clientData, ...newClientData });
    setShowClientForm(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-semibold">
                Client Info
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Add the Client details here.
              </p>
            </div>
            <span className="text-sm text-gray-500">2/2</span>
          </div>
        </DialogHeader>
        <div className="space-y-4 mt-6">
          {!showClientForm ? (
            <>
              <div>
                <Label>Find Client By Name</Label>
                <div className="relative mt-1">
                  <Input
                    placeholder="Find Client By Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedClient === client.id
                        ? "bg-gray-100"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => handleClientSelect(client.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{client.name}</span>
                      {selectedClient === client.id && (
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
                <div className="border-t pt-2">
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={handleAddNewClient}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add New Client</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <NewClientForm
              onSubmit={handleNewClientSubmit}
              onCancel={() => setShowClientForm(false)}
            />
          )}
        </div>
        {!showClientForm && (
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onComplete} className="bg-black hover:bg-gray-800">
              Add Job
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
