import { useEffect, useInsertionEffect } from "react";

export const useIsomorphicInsertionEffect =
  typeof window === "undefined" ? useEffect : useInsertionEffect;
