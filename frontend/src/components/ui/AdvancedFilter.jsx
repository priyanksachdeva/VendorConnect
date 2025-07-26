import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Badge } from "./index";

const AdvancedFilter = ({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter((value) =>
      Array.isArray(value) ? value.length > 0 : value !== "" && value !== null
    ).length;
  };

  const renderFilterInput = (filter) => {
    const value =
      activeFilters[filter.key] || (filter.type === "multiselect" ? [] : "");

    switch (filter.type) {
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          >
            <option value="">All {filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {value.map((selectedValue) => {
                const option = filter.options.find(
                  (opt) => opt.value === selectedValue
                );
                return (
                  <Badge
                    key={selectedValue}
                    variant="primary"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => {
                      const newValue = value.filter((v) => v !== selectedValue);
                      onFilterChange(filter.key, newValue);
                    }}
                  >
                    {option?.label} ✕
                  </Badge>
                );
              })}
            </div>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value && !value.includes(e.target.value)) {
                  onFilterChange(filter.key, [...value, e.target.value]);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            >
              <option value="">Add {filter.label}...</option>
              {filter.options
                .filter((option) => !value.includes(option.value))
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>
        );

      case "range":
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min</label>
              <input
                type="number"
                value={value.min || ""}
                onChange={(e) =>
                  onFilterChange(filter.key, { ...value, min: e.target.value })
                }
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max</label>
              <input
                type="number"
                value={value.max || ""}
                onChange={(e) =>
                  onFilterChange(filter.key, { ...value, max: e.target.value })
                }
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              />
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {filter.options.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onFilterChange(filter.key, [...value, option.value]);
                    } else {
                      onFilterChange(
                        filter.key,
                        value.filter((v) => v !== option.value)
                      );
                    }
                  }}
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            placeholder={`Filter by ${filter.label.toLowerCase()}...`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          />
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="relative"
        icon={<span>🔧</span>}
      >
        Advanced Filters
        {getActiveFilterCount() > 0 && (
          <Badge
            variant="primary"
            size="sm"
            className="absolute -top-2 -right-2"
          >
            {getActiveFilterCount()}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-25 z-40"
            />

            {/* Filter Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  🔧 Advanced Filters
                </h3>
                <div className="flex space-x-2">
                  {getActiveFilterCount() > 0 && (
                    <Button
                      onClick={onClearAll}
                      variant="ghost"
                      size="sm"
                      className="text-error-600"
                    >
                      Clear All
                    </Button>
                  )}
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              <div className="space-y-6 max-h-96 overflow-y-auto">
                {filters.map((filter, index) => (
                  <motion.div
                    key={filter.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      {filter.label}
                    </label>
                    {renderFilterInput(filter)}
                  </motion.div>
                ))}
              </div>

              {getActiveFilterCount() > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">
                      Active filters:
                    </span>
                    {Object.entries(activeFilters).map(([key, value]) => {
                      if (Array.isArray(value) && value.length === 0)
                        return null;
                      if (
                        !Array.isArray(value) &&
                        (value === "" || value === null)
                      )
                        return null;

                      const filter = filters.find((f) => f.key === key);
                      if (!filter) return null;

                      return (
                        <Badge
                          key={key}
                          variant="secondary"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() =>
                            onFilterChange(key, Array.isArray(value) ? [] : "")
                          }
                        >
                          {filter.label} ✕
                        </Badge>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedFilter;
