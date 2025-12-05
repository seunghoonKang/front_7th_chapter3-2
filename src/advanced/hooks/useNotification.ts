import { useAtom } from "jotai";
import { notificationsAtom } from "../atoms/notifications";
import { NotificationType } from "../atoms/notifications";

export function useNotification() {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const addNotification = (
    msg: string,
    type: "error" | "success" | "warning" = "success"
  ) => {
    const id = String(Date.now());
    const newNotification: NotificationType = { id, message: msg, type };

    // atom 업데이트
    setNotifications((prev) => [...prev, newNotification]);

    // 3초 후 자동 제거
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, addNotification, clearNotification };
}
