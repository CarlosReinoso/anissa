"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";

export default function SiteStatusToggle() {
  const [underConstruction, setUnderConstruction] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSetting = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "under_construction")
        .maybeSingle();

      if (error) setError(error.message);
      else setUnderConstruction(data?.value === true);
      setLoading(false);
    };
    fetchSetting();
  }, []);

  const handleToggle = async () => {
    const next = !underConstruction;
    setSaving(true);
    setError(null);

    const { error } = await supabase.from("site_settings").upsert({
      key: "under_construction",
      value: next,
      updated_at: new Date().toISOString(),
    });

    if (error) setError(error.message);
    else setUnderConstruction(next);
    setSaving(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Public Site Status</h2>
        <p className="text-gray-400">
          {loading
            ? "Loading..."
            : underConstruction
            ? "Visitors currently see the “Under Construction” page."
            : "The site is live and showing normally."}
        </p>
        {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-sm font-medium ${
            underConstruction ? "text-fourth" : "text-green-400"
          }`}
        >
          {underConstruction ? "Under Construction" : "Live"}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={underConstruction}
          aria-label="Toggle under construction mode"
          disabled={loading || saving}
          onClick={handleToggle}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors disabled:opacity-50 ${
            underConstruction ? "bg-fourth" : "bg-green-500"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              underConstruction ? "translate-x-8" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
