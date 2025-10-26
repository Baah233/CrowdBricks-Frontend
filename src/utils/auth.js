export const logout = () => {
  // ✅ Remove authentication info
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // ✅ Optionally clear sessionStorage if you store any sensitive info
  sessionStorage.clear();

  // ✅ Redirect user to login (hard redirect ensures all state is reset)
  window.location.replace("/login");
};
