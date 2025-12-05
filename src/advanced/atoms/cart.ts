import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CartItem } from "../../types";

export const cartAtom = atomWithStorage<CartItem[]>("cart", []);

// useEffect를 사용하지 않고 장바구니 아이템 개수를 계산하는 atom
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});
