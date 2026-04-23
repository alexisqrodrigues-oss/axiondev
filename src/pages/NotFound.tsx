import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";

const NotFound = () => {
  const { t } = useI18n();
  useEffect(() => {
    document.title = "404 — axison.dev";
  }, []);
  return (
    <div className="mx-auto max-w-md text-center py-24">
      <p className="font-mono text-xs text-muted-foreground">~/axison.dev/404/</p>
      <h1 className="font-display text-7xl mt-4 mb-2">404</h1>
      <p className="font-mono text-sm text-muted-foreground mb-6">
        cat: page: No such file or directory
      </p>
      <Link to="/" className="text-primary hover:underline font-mono text-sm">
        cd ~/
      </Link>
    </div>
  );
};

export default NotFound;
