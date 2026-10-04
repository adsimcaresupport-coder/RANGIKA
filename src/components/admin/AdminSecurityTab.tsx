import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  History,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSecurityTab: React.FC = () => {
  const {
    adminAuth,
    adminLogout,
    changeAdminPin,
    adminAuditLogs,
    showToast,
  } = useStore();

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setPinMessage({ text: 'New PIN must be at least 4 digits', isError: true });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMessage({ text: 'New PIN and Confirmation do not match', isError: true });
      return;
    }

    setIsUpdating(true);
    setPinMessage(null);
    const result = await changeAdminPin(currentPin, newPin);
    setIsUpdating(false);

    if (result.success) {
      setPinMessage({ text: 'Security PIN successfully updated.', isError: false });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } else {
      setPinMessage({ text: result.message || 'Incorrect current PIN', isError: true });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#1E2D22]">
            Administrator Security & Audit Governance
          </h3>
          <p className="text-xs text-[#8E7B6C]">
            Manage session credentials, change master owner access PIN, and review cryptographic activity audit trails.
          </p>
        </div>

        <button
          onClick={adminLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock / Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Session & Credentials */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#EAE3D5]">
            <UserCheck className="w-5 h-5 text-[#1E2D22]" />
            <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
              Active Authenticated Session
            </h4>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E5DAC8] space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#EAE3D5]">
              <span className="text-[#6B5B4E]">Current Role:</span>
              <span className="font-bold uppercase tracking-wider text-emerald-800">
                {adminAuth.adminRole} (Super Administrator)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE3D5]">
              <span className="text-[#6B5B4E]">Administrator Name:</span>
              <span className="font-bold text-[#1E2D22]">{adminAuth.adminName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE3D5]">
              <span className="text-[#6B5B4E]">Registered Email:</span>
              <span className="font-medium text-[#1E2D22]">{adminAuth.adminEmail}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#6B5B4E]">Session Status:</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active & Protected</span>
              </span>
            </div>
          </div>

          {/* Change PIN Form */}
          <div className="pt-2">
            <h5 className="font-semibold text-xs text-[#1E2D22] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[#D4943E]" />
              <span>Update Master Security PIN</span>
            </h5>

            <form onSubmit={handleUpdatePin} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Current Master PIN
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="Default: 8822"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    New PIN (min 4 digits)
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    placeholder="••••"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Confirm New PIN
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    placeholder="••••"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none font-mono text-sm"
                  />
                </div>
              </div>

              {pinMessage && (
                <div
                  className={`p-2.5 rounded-xl border text-xs ${
                    pinMessage.isError
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {pinMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-2.5 bg-[#1E2D22] hover:bg-[#2C3E30] text-white rounded-xl font-semibold transition-colors cursor-pointer"
              >
                {isUpdating ? 'Updating PIN...' : 'Save New Security PIN'}
              </button>
            </form>
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EAE3D5]">
            <ShieldCheck className="w-5 h-5 text-[#D4943E]" />
            <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
              Security Architecture
            </h4>
          </div>

          <div className="space-y-3 text-xs text-[#55473A] leading-relaxed">
            <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D5]">
              <h5 className="font-bold text-[#1E2D22] mb-1">Role-Based Access Enforcement</h5>
              <p>
                Only authenticated administrators can view patron contact data, modify catalog prices, change stock numbers, or confirm orders. Public visitors cannot access administrative routes or private backend logs.
              </p>
            </div>

            <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D5]">
              <h5 className="font-bold text-[#1E2D22] mb-1">Session Termination</h5>
              <p>
                When you click "Lock / Sign Out", your administrative credentials are removed from browser memory, preventing unauthorized access on shared devices.
              </p>
            </div>

            <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D5]">
              <h5 className="font-bold text-[#1E2D22] mb-1">Audit Trail Immutability</h5>
              <p>
                All destructive operations (deletions, price shifts, status updates) record an indelible audit entry with timestamp and operator identity below.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#C85A32]" />
            <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
              Administrative Activity Audit Trail
            </h4>
          </div>
          <span className="text-xs text-[#8E7B6C]">{adminAuditLogs.length} logged actions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[#8E7B6C] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5">Timestamp</th>
                <th className="py-2.5">Action</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Details & Scope</th>
                <th className="py-2.5 text-right">Performed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {adminAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF7F2]/50 text-[#3E342B]">
                  <td className="py-2.5 font-mono text-[11px] text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 font-bold text-[#1E2D22]">{log.action}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 uppercase">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-2.5 text-gray-600 max-w-md">{log.details}</td>
                  <td className="py-2.5 text-right font-medium text-gray-500 whitespace-nowrap">{log.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
