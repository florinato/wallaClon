// src/components/products/ProductFilters.tsx

import { useState } from 'react';
import api from '../../services/api';

interface ProductFiltersProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  onFilterChange: (filters: { minPrice?: string; maxPrice?: string; condition?: string }) => void;
  onApplyFilters: () => void;
}

export const ProductFilters = ({ searchTerm, onSearch, onFilterChange, onApplyFilters }: ProductFiltersProps) => {
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', condition: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    onFilterChange({ ...filters, [name]: value });
  };

  // Obtener sugerencias de autocompletado
  const fetchSuggestions = async (query: string) => {
    if (!query) return setSuggestions([]);
    try {
      const response = await api.get('/products/tags', { params: { search: query } });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  return (
    <div className="mb-6 relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            onSearch(e.target.value);
            fetchSuggestions(e.target.value); // Llamar a las sugerencias en tiempo real
          }}
          placeholder="Buscar productos"
          className="border border-gray-300 rounded-full p-3 px-5 w-full shadow-sm focus:outline-none focus:border-teal-500"
        />
        <button
          onClick={onApplyFilters}
          className="bg-teal-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-teal-600 transition focus:outline-none"
        >
          Buscar
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full shadow-md hover:bg-gray-400 transition focus:outline-none"
        >
          Filtros
        </button>
      </div>

      {/* Autocompletado de etiquetas */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
          {suggestions.map((tag) => (
            <div
              key={tag}
              onClick={() => {
                onSearch(tag);
                setSuggestions([]); // Limpiar sugerencias después de seleccionar una
              }}
              className="p-2 cursor-pointer hover:bg-teal-100"
            >
              {tag}
            </div>
          ))}
        </div>
      )}

      {/* Menú desplegable de filtros */}
      {showFilters && (
        <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-lg p-4">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              placeholder="Precio mínimo"
              className="border border-gray-300 rounded-full p-2 w-full md:w-auto shadow-sm focus:outline-none focus:border-teal-500"
            />
            <input
              type="text"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              placeholder="Precio máximo"
              className="border border-gray-300 rounded-full p-2 w-full md:w-auto shadow-sm focus:outline-none focus:border-teal-500"
            />
            <select
              name="condition"
              value={filters.condition}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-full p-2 w-full md:w-auto shadow-sm focus:outline-none focus:border-teal-500"
            >
              <option value="">Condición</option>
              <option value="new">Nuevo</option>
              <option value="like-new">Como Nuevo</option>
              <option value="good">Bueno</option>
              <option value="fair">Aceptable</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};


