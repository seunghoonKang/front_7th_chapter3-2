import { useState } from "react";
import { useDebounce } from "../utils/hooks/useDebounce";

export const useSearch = (delay: number = 500) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
  };
};
