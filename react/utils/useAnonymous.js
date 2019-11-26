import { useSSR } from "vtex.render-runtime";

export const useAnonymous = account => {
  const isSSR = useSSR();
  if (isSSR) {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getCookie } = require("./dom-utils");
  const storeId = getCookie("rcs_storeId.s" + account);
  if (!storeId) {
    return {};
  }

  const anonymous = getCookie("rcs_anonymousUserId.s" + storeId);
  if (!anonymous) {
    return {};
  }

  return {};
};
