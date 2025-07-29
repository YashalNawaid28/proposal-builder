"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
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
  onComplete: (data: any) => void;
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
  const [showClientList, setShowClientList] = useState(false);

  const clients = [
    { id: "1", name: "Customer 1" },
    { id: "2", name: "Customer 2" },
    { id: "3", name: "Customer 3" },
  ];

  const filteredClients = clients; // Show all clients, no filtering

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

  const handleSave = () => {
    onComplete(clientData);
  };

  const handleSearchFocus = () => {
    // Don't show list on focus, only when user types
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Always show list for design purposes
    setShowClientList(true);
  };

  // Reset showClientList when dialog opens
  const handleDialogOpen = () => {
    setShowClientList(true); // Always show list for design
    setSearchTerm("");
    setSelectedClient("");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          handleDialogOpen();
        } else {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[370px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-[16px] font-semibold">
                Client Info
              </DialogTitle>
              <p className="text-[14px] text-[#667085]">
                Add the Client details here.
              </p>
            </div>
            <span className="text-sm text-[#667085]">2/2</span>
          </div>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {!showClientForm ? (
            <>
              <div>
                <div className="relative mt-1">
                  <Input
                    placeholder="Find Client By Name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    autoFocus={false}
                    className="pl-10 w-full border-[#DEE1EA] focus:ring-0 focus:outline-none"
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
              {showClientList && (
                <div className="border border-[#E0E0E0] rounded-md bg-white">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className={`px-3 py-2 cursor-pointer border-b border-[#E0E0E0] last:border-b-0 ${
                        selectedClient === client.id
                          ? "bg-[#F9F9FB]"
                          : "hover:bg-[#F9F9FB]"
                      }`}
                      onClick={() => handleClientSelect(client.id)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-[#1F2937]">
                          {client.name}
                        </span>
                        {selectedClient === client.id && (
                          <svg
                            className="w-4 h-4 text-green-600"
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
                  <div className="border-t border-[#E0E0E0]">
                    <div
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#F9F9FB]"
                      onClick={handleAddNewClient}
                    >
                      <Plus className="w-4 h-4 text-[#6B7280]" />
                      <span className="text-sm font-medium text-[#1F2937]">
                        Add New Client
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <NewClientForm
              onSubmit={handleNewClientSubmit}
              onCancel={() => setShowClientForm(false)}
            />
          )}
        </div>
        {!showClientForm && (
          <section className="flex items-center text-[14px] mt-2 gap-2 font-semibold">
            <button
              onClick={onClose}
              className="bg-[#F9F9FB] h-10 w-full flex items-center justify-center px-3 gap-2 border border-[#E0E0E0] rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="h-10 bg-black w-full flex items-center text-white justify-center px-3 gap-2 rounded-md"
            >
              Add Job
            </button>
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
};
