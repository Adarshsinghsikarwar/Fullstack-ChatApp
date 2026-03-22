import React from "react";

const SettingPage = () => {
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-100 rounded-3xl p-6 space-y-8 glass shadow-xl shadow-indigo-100/20">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="mt-2 text-base-content/60">Customize your experience</p>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-base-200 rounded-xl border border-base-300">
              <h2 className="font-semibold mb-2">Theme</h2>
              <p className="text-sm text-base-content/60 mb-4">Choose between light and dark mode</p>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-white border-2 border-primary rounded-lg font-bold">Light</button>
                <button className="px-4 py-2 bg-zinc-900 text-white rounded-lg font-bold">Dark</button>
              </div>
            </div>
            
            <div className="p-4 bg-base-200 rounded-xl border border-base-300">
              <h2 className="font-semibold mb-2">Notifications</h2>
              <p className="text-sm text-base-content/60">Manage your alert preferences</p>
              <div className="mt-4 flex items-center justify-between">
                <span>Sound effects</span>
                <div className="w-12 h-6 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 size-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
