import { useState, useMemo, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { getSearchIndex, type SearchItem } from "./searchIndex";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (action: SearchItem['action']) => void;
}

const SearchModal = ({ isOpen, onClose, onNavigate }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const allItems = useMemo(() => getSearchIndex(), [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q)
    );
  }, [query, allItems]);

  if (!isOpen) return null;

  const handleSelect = (item: SearchItem) => {
    onNavigate(item.action);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-16 md:pt-24 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[75vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 p-3 border-b border-gray-200">
          <Icon name="Search" size={20} className="text-gray-400 flex-shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по платформе"
            className="flex-1 py-2 bg-transparent border-none focus:outline-none text-base"
          />
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Закрыть"
          >
            <Icon name="X" size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              Ничего не найдено
            </div>
          ) : (
            <div className="p-2">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-wb-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-wb-purple/10 flex-shrink-0">
                    <Icon name={item.icon} size={18} className="text-wb-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-wb-gray-900 truncate">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-xs text-wb-gray-500 truncate">{item.subtitle}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-wb-gray-400 uppercase tracking-wide flex-shrink-0">{item.section}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
