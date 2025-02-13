/**
 * @function
 * @name AuthenticationCheck
 * @description Immediately invoked function expression (IIFE) that checks for user authentication token in localStorage.
 *              If the token is absent and the current page is not in the exclusion list (privacy policy, legal notice, login, or signup pages),
 *              it redirects the user to the login page. This ensures that unauthorized users are not able to access protected pages.
 */
(function () {
  const excludedPaths = [
    "privacy_policy.html",
    "legal_notice.html",
    "login.html",
    "signup.html",
  ];

  const currentPath = window.location.pathname;

  // Überprüfe, ob die aktuelle URL in der Ausschlussliste ist
  const isExcluded = excludedPaths.some((path) => currentPath.endsWith(path));

  // Wenn die URL nicht in der Ausschlussliste ist und kein Token vorhanden ist, leite zum Login um
  if (!isExcluded && !localStorage.getItem("token")) {
    window.location.href = "/assets/templates/login.html"; // Passe den Pfad an
  }
})();