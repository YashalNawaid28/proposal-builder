"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewClientFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const NewClientForm = ({ onSubmit, onCancel }: NewClientFormProps) => {
  const [formData, setFormData] = useState({
    legal_name: "",
    clientLocation: "", // Single address input
    client_contact: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to parse address into components
  const parseAddress = (address: string) => {
    // Simple address parsing - you might want to use a more sophisticated library
    const parts = address.split(',').map(part => part.trim());
    
    // Default structure: Street, City, State Postcode, Country
    let street = '';
    let city = '';
    let state = '';
    let postcode = '';
    let country = '';

    if (parts.length >= 1) street = parts[0];
    if (parts.length >= 2) city = parts[1];
    if (parts.length >= 3) {
      // Handle state and postcode together
      const statePostcode = parts[2];
      const statePostcodeMatch = statePostcode.match(/^(.+?)\s+(\d{4,5})$/);
      if (statePostcodeMatch) {
        state = statePostcodeMatch[1];
        postcode = statePostcodeMatch[2];
      } else {
        state = statePostcode;
      }
    }
    if (parts.length >= 4) country = parts[3];

    return {
      street,
      city,
      state,
      postcode,
      country
    };
  };

  const handleSubmit = async () => {
    if (!formData.legal_name.trim()) {
      setError("Client name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Parse the address into components
      const addressComponents = parseAddress(formData.clientLocation || '');

      const clientData = {
        legal_name: formData.legal_name,
        street: addressComponents.street,
        city: addressComponents.city,
        state: addressComponents.state,
        postcode: addressComponents.postcode,
        country: addressComponents.country,
        client_contact: formData.client_contact,
        phone: formData.phone,
      };

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create client');
      }

      const result = await response.json();
      
      // Map the saved client data to the format expected by the parent component
      const mappedClientData = {
        clientId: result.data[0].id, // Include the client ID
        clientName: result.data[0].legal_name,
        clientLocation: formData.clientLocation,
        clientContact: result.data[0].client_contact || result.data[0].legal_name,
        clientPhone: result.data[0].phone || '',
      };

      onSubmit(mappedClientData);
    } catch (error) {
      console.error('Error creating client:', error);
      setError(error instanceof Error ? error.message : 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      
      <div>
        <Label htmlFor="legal_name" className="text-sm font-medium">
          Client Name *
        </Label>
        <Input
          id="legal_name"
          value={formData.legal_name}
          onChange={(e) =>
            setFormData({ ...formData, legal_name: e.target.value })
          }
          className="mt-1 w-full border-[#DEE1EA] focus:ring-0 focus:outline-none"
          placeholder="Enter client name"
        />
      </div>

      <div>
        <Label htmlFor="clientLocation" className="text-sm font-medium">
          Location
        </Label>
        <Input
          id="clientLocation"
          value={formData.clientLocation}
          onChange={(e) =>
            setFormData({ ...formData, clientLocation: e.target.value })
          }
          className="mt-1 w-full border-[#DEE1EA] focus:ring-0 focus:outline-none"
          placeholder="Street, City, State Postcode, Country"
        />
      </div>

      <div>
        <Label htmlFor="client_contact" className="text-sm font-medium">
          Contact
        </Label>
        <Input
          id="client_contact"
          value={formData.client_contact}
          onChange={(e) =>
            setFormData({ ...formData, client_contact: e.target.value })
          }
          className="mt-1 w-full border-[#DEE1EA] focus:ring-0 focus:outline-none"
          placeholder="Enter contact person name"
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-sm font-medium">
          Phone
        </Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          className="mt-1 mb-2 w-full border-[#DEE1EA] focus:ring-0 focus:outline-none"
          placeholder="Enter phone number"
        />
      </div>

      <section className="flex items-center text-[14px] gap-2 font-semibold">
        <button
          onClick={onCancel}
          disabled={loading}
          className="bg-[#F9F9FB] h-10 w-full flex items-center justify-center px-3 gap-2 border border-[#E0E0E0] rounded-md disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="h-10 bg-black w-full flex items-center text-white justify-center px-3 gap-2 rounded-md disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Add Client'}
        </button>
      </section>
    </div>
  );
};
