export const isUserAdmin = (): boolean => {
  if (typeof window === "undefined") return false;
  const role = localStorage.getItem("userRole");
  return role === "admin";
};

export const getUserRole = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userRole");
};

export const getUserEmail = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userEmail");
};

export const clearUserData = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
}; 