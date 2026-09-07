import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

interface AddressState {
  addresses: Address[];
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefault: (id: string) => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addresses: [],
      addAddress: (address) =>
        set((state) => {
          const id = crypto.randomUUID();
          const makeDefault = state.addresses.length === 0 || address.isDefault;
          return {
            addresses: [
              ...state.addresses.map((a) =>
                makeDefault ? { ...a, isDefault: false } : a
              ),
              { ...address, id, isDefault: makeDefault },
            ],
          };
        }),
      updateAddress: (id, address) =>
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === id
              ? { ...address, id }
              : address.isDefault
                ? { ...a, isDefault: false }
                : a
          ),
        })),
      removeAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),
      setDefault: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        })),
    }),
    { name: "anime-luxe-addresses" }
  )
);
