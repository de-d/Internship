import { useState, useEffect } from "react";

function useFetch<T>(url: string): { data: T | null } {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        return response.json();
      })
      .then(setData)
      .catch((error) => console.error("Ошибка при загрузке данных:", error));
  }, [url]);

  return { data };
}

export default useFetch;
