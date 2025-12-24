const Setings = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Settings</h2>
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <h3 className="text-white font-semibold mb-2">Account</h3>
            <p className="text-sm text-gray-400">
              Manage your account settings
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <h3 className="text-white font-semibold mb-2">Notifications</h3>
            <p className="text-sm text-gray-400">
              Configure notification preferences
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <h3 className="text-white font-semibold mb-2">Language</h3>
            <p className="text-sm text-gray-400">Change interface language</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setings;
