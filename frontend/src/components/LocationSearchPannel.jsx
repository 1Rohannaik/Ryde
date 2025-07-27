import React, { memo } from "react";

const LocationSearchPanel = ({
  suggestions = [],
  setVehiclePanel,
  setPanelOpen,
  setPickup,
  setDestination,
  activeField,
  isLoading = false,
}) => {
  console.log("LocationSearchPanel rendered with props:", {
    suggestions,
    activeField,
    isLoading,
  });

  const handleSuggestionClick = (suggestion) => {
    console.log("Suggestion clicked:", suggestion);
    if (activeField === "pickup") {
      setPickup(suggestion);
    } else if (activeField === "destination") {
      setDestination(suggestion);
    }
    setVehiclePanel(true);
    setPanelOpen(false);
  };

  const handleKeyDown = (e, suggestion) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSuggestionClick(suggestion);
    }
  };

  return (
    <div
      className="p-4 bg-white max-h-[70vh] overflow-y-auto"
      role="region"
      aria-label="Location suggestions"
    >
      {isLoading ? (
        <div
          className="flex justify-center items-center py-6"
          role="status"
          aria-label="Loading suggestions"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-gray-700"></div>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm" role="alert">
            No results found. Try a different search term.
          </p>
        </div>
      ) : (
        <ul className="space-y-2" role="listbox">
          {suggestions.map((elem, idx) => (
            <li
              key={idx}
              onClick={() => handleSuggestionClick(elem)}
              onKeyDown={(e) => handleKeyDown(e, elem)}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
              role="option"
              aria-selected={false}
              tabIndex={0}
            >
              <div className="bg-gray-200 h-9 w-9 flex items-center justify-center rounded-full shrink-0">
                <i className="ri-map-pin-2-fill text-gray-600 text-base"></i>
              </div>
              <h4 className="font-medium text-gray-800 text-base truncate">
                {elem}
              </h4>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default memo(LocationSearchPanel);
