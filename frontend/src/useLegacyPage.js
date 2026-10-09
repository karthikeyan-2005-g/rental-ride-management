import { useEffect } from "react";
import authNavigationScript from "./legacy/auth-nav.js?raw";

export function useLegacyPage(
  { title, bodyClass, requiresLogin },
  pageScript = "",
) {
  useEffect(() => {
    document.title = title;
    document.body.className = bodyClass;

    if (requiresLogin) {
      document.body.setAttribute("data-requires-login", "");
    } else {
      document.body.removeAttribute("data-requires-login");
    }

    const scripts = [authNavigationScript, pageScript]
      .filter(Boolean)
      .map((source) => {
        const script = document.createElement("script");
        script.textContent = source;
        document.body.appendChild(script);
        return script;
      });

    return () => {
      scripts.forEach((script) => script.remove());
    };
  }, [title, bodyClass, requiresLogin, pageScript]);
}
