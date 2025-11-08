import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"; // if you don't have a Switch component, replace with checkbox
import { useNavigate } from "react-router-dom";
import { BRAND } from "@/lib/data";

/*
  InvestorSettings.jsx
  - New settings page for the investor dashboard (route: /investor/settings)
  - Persists preferences in localStorage and applies them globally:
      * theme: light / dark
      * reduceMotion: boolean
      * compactMode: boolean (reduces paddings / font sizes via body class)
      * experimentalFeatures: boolean
  - Emits a custom event 'cb-settings-changed' (detail: settings) for other parts of the app to listen to
  - Immediately applies theme and layout changes so the page "really have effect"
*/

const LS_KEY = "cb_user_settings_v1";

export default function InvestorSettings() {
  const navigate = useNavigate();

  const defaultSettings = {
    theme: "light", // or 'dark'
    reduceMotion: false,
    compactMode: false,
    experimentalFeatures: false,
  };

  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // apply settings to the document immediately
  useEffect(() => {
    applySettings(settings);
    // persist
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
    } catch (e) {
      // ignore
    }
    // broadcast
    window.dispatchEvent(new CustomEvent("cb-settings-changed", { detail: settings }));
  }, [settings]);

  function applySettings(s) {
    // theme: toggle 'dark' class on html element
    const html = document.documentElement;
    if (s.theme === "dark") {
      html.classList.add("dark");
      // optional: set CSS variables for brand if you want dynamic theming
      html.style.setProperty("--brand-primary", BRAND.primary);
      html.style.setProperty("--brand-accent", BRAND.accent);
    } else {
      html.classList.remove("dark");
      html.style.removeProperty("--brand-primary");
      html.style.removeProperty("--brand-accent");
    }

    // reduce motion: add data attribute
    if (s.reduceMotion) {
      html.setAttribute("data-reduce-motion", "true");
    } else {
      html.removeAttribute("data-reduce-motion");
    }

    // compact mode: add class to body
    if (s.compactMode) {
      document.body.classList.add("cb-compact");
    } else {
      document.body.classList.remove("cb-compact");
    }

    // experimental features flag stored only as data attribute for other scripts
    if (s.experimentalFeatures) {
      html.setAttribute("data-experimental", "true");
    } else {
      html.removeAttribute("data-experimental");
    }
  }

  const update = (patch) => setSettings((prev) => ({ ...prev, ...patch }));

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    toastLocal("Settings reset to defaults");
  };

  const toastLocal = (message) => {
    // naive toast - if your project has a toasting hook, replace this
    console.info(message);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: BRAND.primary }}>Dashboard Settings</h1>
            <p className="text-sm text-slate-600 mt-1">Personalise your CrowdBricks experience — changes apply immediately.</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
            <Button className="bg-yellow-400 text-slate-900" onClick={() => { resetToDefaults(); }}>Reset</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <Button
                      size="sm"
                      variant={settings.theme === "light" ? "default" : "outline"}
                      onClick={() => update({ theme: "light" })}
                    >
                      Light
                    </Button>
                    <Button
                      size="sm"
                      variant={settings.theme === "dark" ? "default" : "outline"}
                      onClick={() => update({ theme: "dark" })}
                    >
                      Dark
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Reduce motion</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={settings.reduceMotion} onChange={(e) => update({ reduceMotion: e.target.checked })} />
                      <span className="text-sm text-slate-600">Reduce non-essential motion</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label>Compact mode</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={settings.compactMode} onChange={(e) => update({ compactMode: e.target.checked })} />
                      <span className="text-sm text-slate-600">Use a denser layout to show more information</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced & Experimental</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Experimental features</Label>
                  <div className="mt-2">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={settings.experimentalFeatures} onChange={(e) => update({ experimentalFeatures: e.target.checked })} />
                      <span className="text-sm text-slate-600">Enable early access features (may be unstable)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label>Primary color (brand)</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      type="color"
                      value={BRAND.primary}
                      onChange={(e) => {
                        document.documentElement.style.setProperty("--brand-primary", e.target.value);
                        // keep brand primary persisted in local storage for consistency if required
                      }}
                    />
                    <span className="text-sm text-slate-600">Customize primary color for the dashboard (preview only)</span>
                  </div>
                </div>

                <div>
                  <Label>Compact spacing preview</Label>
                  <div className="mt-2 p-3 border rounded">
                    <p className="text-sm text-slate-600">Toggle compact mode to reduce paddings and font-sizes across dashboard panels</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="bg-blue-600 text-white" onClick={() => { localStorage.setItem(LS_KEY, JSON.stringify(settings)); toastLocal("Settings saved"); }}>
            Save settings
          </Button>
          <Button variant="outline" onClick={() => { setSettings(defaultSettings); toastLocal("Reverted to default in UI (and persisted)"); }}>
            Revert
          </Button>
        </div>
      </div>
    </div>
  );
}