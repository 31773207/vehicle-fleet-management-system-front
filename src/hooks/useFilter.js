import { useState, useMemo } from "react";

/**
 * Hook عام للـ filter + search
 * يستعملوه كل pages
 */
export const useFilter = (data, searchKeys = []) => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchMatch = searchKeys.some((key) =>
        String(item[key] || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );

      // default filter logic (تبدلوها حسب الصفحة)
      if (filter === "All") return searchMatch;

      return searchMatch;
    });
  }, [data, search, filter]);

  return {
    filter,
    setFilter,
    search,
    setSearch,
    filteredData,
  };
};