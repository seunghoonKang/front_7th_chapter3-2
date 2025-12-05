// TODO: LocalStorage Hook
// 힌트:
// 1. localStorage와 React state 동기화
// 2. 초기값 로드 시 에러 처리
// 3. 저장 시 JSON 직렬화/역직렬화
// 4. 빈 배열이나 undefined는 삭제
//
// 반환값: [저장된 값, 값 설정 함수]

import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return initialValue;

      return JSON.parse(saved);
    } catch (error) {
      console.error(`Error "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const shouldRemove =
        value === undefined ||
        value === null ||
        (Array.isArray(value) && value.length === 0);

      if (shouldRemove) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
