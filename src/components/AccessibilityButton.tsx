"use client";

import { useState, useEffect } from "react";

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  linkHighlight: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  reducedMotion: false,
  linkHighlight: false,
};

export default function AccessibilityButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("accessibility-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        applySettings(parsed);
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  // Apply settings to document
  const applySettings = (s: AccessibilitySettings) => {
    document.documentElement.style.fontSize = `${s.fontSize}%`;
    
    if (s.highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    
    if (s.reducedMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
    
    if (s.linkHighlight) {
      document.documentElement.classList.add("highlight-links");
    } else {
      document.documentElement.classList.remove("highlight-links");
    }
  };

  // Save and apply settings
  const updateSettings = (newSettings: AccessibilitySettings) => {
    setSettings(newSettings);
    localStorage.setItem("accessibility-settings", JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  const increaseFontSize = () => {
    if (settings.fontSize < 150) {
      updateSettings({ ...settings, fontSize: settings.fontSize + 10 });
    }
  };

  const decreaseFontSize = () => {
    if (settings.fontSize > 80) {
      updateSettings({ ...settings, fontSize: settings.fontSize - 10 });
    }
  };

  const resetSettings = () => {
    updateSettings(defaultSettings);
  };

  const toggleHighContrast = () => {
    updateSettings({ ...settings, highContrast: !settings.highContrast });
  };

  const toggleReducedMotion = () => {
    updateSettings({ ...settings, reducedMotion: !settings.reducedMotion });
  };

  const toggleLinkHighlight = () => {
    updateSettings({ ...settings, linkHighlight: !settings.linkHighlight });
  };

  return (
    <>
      {/* Accessibility Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="תפריט נגישות"
          aria-expanded={isOpen}
          aria-controls="accessibility-menu"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="4" r="2" fill="currentColor" />
            <path d="M12 6v14" />
            <path d="M8 8l4 2 4-2" />
            <path d="M8 20l4-6 4 6" />
          </svg>
        </button>
      </div>

      {/* Accessibility Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 z-[60]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Panel */}
          <div 
            id="accessibility-menu"
            role="dialog"
            aria-label="הגדרות נגישות"
            className="fixed bottom-20 right-4 w-72 bg-white rounded-xl shadow-2xl z-[70] overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-lg">נגישות</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-blue-500 rounded-lg transition-colors"
                aria-label="סגור תפריט נגישות"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  גודל טקסט: {settings.fontSize}%
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseFontSize}
                    disabled={settings.fontSize <= 80}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-lg font-bold text-gray-900 transition-colors"
                    aria-label="הקטן טקסט"
                  >
                    א-
                  </button>
                  <button
                    onClick={increaseFontSize}
                    disabled={settings.fontSize >= 150}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-lg font-bold text-gray-900 transition-colors"
                    aria-label="הגדל טקסט"
                  >
                    א+
                  </button>
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-3">
                <ToggleOption
                  label="ניגודיות גבוהה"
                  checked={settings.highContrast}
                  onChange={toggleHighContrast}
                />
                <ToggleOption
                  label="הפחתת אנימציות"
                  checked={settings.reducedMotion}
                  onChange={toggleReducedMotion}
                />
                <ToggleOption
                  label="הדגשת קישורים"
                  checked={settings.linkHighlight}
                  onChange={toggleLinkHighlight}
                />
              </div>

              {/* Reset Button */}
              <button
                onClick={resetSettings}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                איפוס הגדרות
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Toggle Option Component
function ToggleOption({ 
  label, 
  checked, 
  onChange 
}: { 
  label: string; 
  checked: boolean; 
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-[-20px]" : ""
          }`}
        />
      </button>
    </label>
  );
}
