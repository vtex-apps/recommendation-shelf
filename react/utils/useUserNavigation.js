import { path } from "ramda";
import { useRuntime, useSSR } from "vtex.render-runtime";

const userNavigationKey = "biggy-user-navigation-info";
const userNavigatonTTL = 1800000;

export const useUserNavigation = () => {
  const {
    route: { path: routePath = "" },
  } = useRuntime();

  const isSSR = useSSR();
  if (isSSR) {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getCookie, setCookie } = require("./dom-utils");
  const google = routePath.indexOf("gclid=") !== -1;
  const bing = routePath.indexOf("msbing=") !== -1;

  const oldInfo = JSON.parse(getCookie(userNavigationKey));

  const userNavigation = {
    google: google || path(["google"], oldInfo) || false,
    bing: bing || path(["bing"], oldInfo) || false,
  };

  setCookie(
    userNavigationKey,
    JSON.stringify(userNavigation),
    userNavigatonTTL,
  );

  return { userNavigation };
};
