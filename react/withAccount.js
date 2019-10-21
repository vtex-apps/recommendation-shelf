import React from "react";
import { useRuntime } from "vtex.render-runtime";

export default function withAccount(WrappedComponent) {
  const withAccount = props => {
    // eslint-disable-next-line
    const { account } = useRuntime();

    return <WrappedComponent {...props} account={account} />;
  };

  return withAccount;
}
