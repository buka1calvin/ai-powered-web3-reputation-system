import { useState, useEffect } from "react";

interface SearchOptions<T> {
  fields?: Array<keyof T>;
  customFilter?: (item: T, query: string) => boolean;
}

const useSearch = <T extends Record<string, any>>(data: T[], options?: SearchOptions<T>) => {
  const [query, setQuery] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);

  // Default filtering logic
  const defaultFilter = (item: T) => {
    if (options?.fields) {
      // Search within specified fields
      return options.fields.some((field) =>
        String(item[field]).toLowerCase().includes(query.toLowerCase())
      );
    }
    // Search all fields if no specific fields are provided
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(query.toLowerCase())
    );
  };

  // Apply custom filter logic if provided, otherwise use default
  const filteredData = data.filter((item) =>
    options?.customFilter ? options.customFilter(item, query) : defaultFilter(item)
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSearching(true);
  };

  useEffect(() => {
    setSearching(false);
  }, [query]);

  return { query, handleSearch, filteredData, searching };
};

export default useSearch;
