export function generateBreadcrumb(url: string) {
  const parts = url.replace("https://github.com/", "").trim().split("/");

  return parts.map((part) => capitalizeFirstLetter(part)).join(" > ");
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getDaysAgo = (dateString: string) => {
  const diff = Date.now() - new Date(dateString).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
