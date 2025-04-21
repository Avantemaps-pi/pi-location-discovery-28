
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to asynchronously log a business view to Supabase via edge function.
 * - Runs only once per component mount, per businessId.
 * - Does not block or delay UI rendering.
 * @param businessId The id of the business to log view for.
 */
export const useLogBusinessView = (businessId?: string | number) => {
  useEffect(() => {
    if (!businessId) return;

    // log view asynchronously, don't await in effect
    const logView = async () => {
      try {
        // Get the current session for the access token
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          // Log but do not throw/app block
          console.warn("Could not fetch user session for log-business-view:", error);
          return;
        }
        if (!session) {
          // Not authenticated, skip
          return;
        }

        const accessToken = session.access_token;
        const response = await fetch("/functions/v1/log-business-view", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            business_id: businessId,
          }),
        });

        // Optional: Check status/log; do nothing visually
        if (!response.ok) {
          console.warn(`log-business-view failed (${response.status}):`, await response.text());
        }
      } catch (err) {
        // Catch all, but do not block rendering
        console.warn("Failed to log business view:", err);
      }
    };

    // Only fire once per visit (on mount)
    logView();
    // Only re-run if businessId changes
  }, [businessId]);
};

export default useLogBusinessView;
