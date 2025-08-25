import { useState } from "react";

export default function AddressStep({ address, setAddress }) {
  const [addresses, setAddresses] = useState([
    "123 Main St, City",
    "456 Market St, City",
  ]);
  const [newAddress, setNewAddress] = useState("");

  const addAddress = () => {
    const trimmed = newAddress.trim();
    if (trimmed) {
      setAddresses((a) => [...a, trimmed]);
      setAddress(trimmed);
      setNewAddress("");
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Select Address</h2>
      <ul className="space-y-2">
        {addresses.map((addr, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <input
              type="radio"
              name="address"
              value={addr}
              checked={address === addr}
              onChange={() => setAddress(addr)}
              className="h-4 w-4"
            />
            <span>{addr}</span>
          </li>
        ))}
      </ul>
      <div className="pt-2 space-y-2">
        <input
          type="text"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          placeholder="Add new address"
          className="w-full rounded border px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={addAddress}
          className="rounded border px-3 py-1 text-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
}

