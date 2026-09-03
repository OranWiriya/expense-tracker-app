const isActiveNavMenu = ({
  pathname,
  url,
}: {
  pathname: string;
  url: string;
}) => {
  if (url === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(url);
};

export { isActiveNavMenu };
