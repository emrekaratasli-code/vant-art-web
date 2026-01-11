import { createContext, useContext, useState, useEffect } from 'react';

const AddressContext = createContext();

export const useAddress = () => useContext(AddressContext);

export const AddressProvider = ({ children }) => {
    const [addresses, setAddresses] = useState([]);

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('vant_saved_addresses');
        if (saved) {
            try {
                setAddresses(JSON.parse(saved));
            } catch (e) {
                console.error('Address parsing error', e);
            }
        }
    }, []);

    // Save to LocalStorage whenever addresses change
    useEffect(() => {
        localStorage.setItem('vant_saved_addresses', JSON.stringify(addresses));
    }, [addresses]);

    const addAddress = (newAddress) => {
        const addressWithId = { ...newAddress, id: Date.now().toString() };
        setAddresses(prev => [...prev, addressWithId]);
        return addressWithId;
    };

    const removeAddress = (id) => {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
    };

    const updateAddress = (id, updatedData) => {
        setAddresses(prev => prev.map(addr => addr.id === id ? { ...addr, ...updatedData } : addr));
    };

    return (
        <AddressContext.Provider value={{ addresses, addAddress, removeAddress, updateAddress }}>
            {children}
        </AddressContext.Provider>
    );
};
