import axionsInstance from "./api";

const logError = (storeSlug, workspace, path, error) => {
  const browser =
    typeof navigator !== "undefined"
      ? navigator.userAgent
      : "server-side-error";

  const message = `Workspace: ${workspace}\nBrowser: ${browser}\nMessage: ${
    error.message
  }\n${error.stack != null ? error.stack : ""}`;

  axionsInstance.post(`/${storeSlug}/io/log`, {
    message,
    url: path,
  });
};

export default logError;
