import { useCallback, useState } from "react";

export interface NotificationType {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = useCallback(
    (msg: string, type: "error" | "success" | "warning" = "success") => {
      const id = String(Date.now());
      setNotifications((prev) => [...prev, { id, message: msg, type }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notifications, addNotification, clearNotification };
}
