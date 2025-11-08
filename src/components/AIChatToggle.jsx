import React, { useState } from "react";
import AIChatWidget from "./AIChatWidget";
import { MessageSquare, X } from "lucide-react";

/*
 Floating AI toggle + small badge.
 - Renders a compact floating button in the bottom-right.
 - When opened, displays AIChatWidget (a client-side chat panel).
 - Lightweight and easily wired to a backend AI endpoint later.
*/

export default function AIChatToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-50 flex items-end justify-end`}>
        {/* If open, the chat widget will render above the button */}
        {open && <AIChatWidget onClose={() => setOpen(false)} />}

        <button
          className="ml-4 flex items-center gap-2 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
          aria-label={open ? "Close chat" : "Open AI assistant"}
          onClick={() => setOpen((s) => !s)}
        >
          {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
          <span className="hidden sm:inline text-sm font-medium">
            {open ? "Close" : "CrowdBot"}
          </span>
        </button>
      </div>
    </>
  );
}