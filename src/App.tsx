import { useState } from 'react';
import { 
  Users, 
  Wallet, 
  CalendarDays, 
  CheckCircle2, 
  CreditCard,
  Phone,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { cn } from './utils/cn';

// Mock Data Types
type Member = {
  id: string;
  name: string;
  phone: string;
  avatar: string;
};

type PaymentStatus = 'pending' | 'completed';

// Mock Members
const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Alain N.', phone: '690 12 34 56', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Beatrice M.', phone: '691 98 76 54', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Charles D.', phone: '692 11 22 33', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Diane K.', phone: '693 44 55 66', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Emmanuel T.', phone: '694 77 88 99', avatar: 'https://i.pravatar.cc/150?u=5' },
];

const CONTRIBUTION_AMOUNT = 10000; // XAF
const TOTAL_POT = CONTRIBUTION_AMOUNT * INITIAL_MEMBERS.length;

export default function App() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [contributions, setContributions] = useState<Record<string, PaymentStatus>>(
    INITIAL_MEMBERS.reduce((acc, member) => ({ ...acc, [member.id]: 'pending' }), {})
  );
  
  const [selectedMemberToPay, setSelectedMemberToPay] = useState<Member | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Beneficiary is determined by the week number (1-indexed)
  // Week 1 -> Member 0, Week 2 -> Member 1, etc.
  const beneficiaryIndex = (currentWeek - 1) % INITIAL_MEMBERS.length;
  const beneficiary = INITIAL_MEMBERS[beneficiaryIndex];

  const totalCollected = Object.values(contributions).filter(status => status === 'completed').length * CONTRIBUTION_AMOUNT;
  const allPaid = totalCollected === TOTAL_POT;

  const handlePay = (member: Member) => {
    setSelectedMemberToPay(member);
  };

  const processPayment = () => {
    if (!selectedMemberToPay) return;
    setIsProcessingPayment(true);
    
    // Simulate Orange Money payment delay
    setTimeout(() => {
      setContributions(prev => ({
        ...prev,
        [selectedMemberToPay.id]: 'completed'
      }));
      setIsProcessingPayment(false);
      setSelectedMemberToPay(null);
    }, 1500);
  };

  const advanceWeek = () => {
    setCurrentWeek(prev => prev + 1);
    // Reset contributions for the new week
    setContributions(
      INITIAL_MEMBERS.reduce((acc, member) => ({ ...acc, [member.id]: 'pending' }), {})
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-orange-500 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6" />
            <h1 className="text-xl font-bold tracking-tight">Njangi Connect</h1>
          </div>
          <div className="flex items-center space-x-2 text-orange-100">
            <Users className="h-5 w-5" />
            <span className="font-medium">{INITIAL_MEMBERS.length} Members</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Dashboard Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Pot */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-500 font-medium">Total Pot This Week</h2>
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">{TOTAL_POT.toLocaleString()} FCFA</p>
              <p className="text-sm text-slate-500 mt-1">
                {CONTRIBUTION_AMOUNT.toLocaleString()} FCFA / member
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">Collected</span>
                <span className="font-medium text-slate-700">{totalCollected.toLocaleString()} FCFA</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(totalCollected / TOTAL_POT) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Current Beneficiary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 md:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800">Week {currentWeek} Beneficiary</h2>
                </div>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                  Cycle {Math.ceil(currentWeek / INITIAL_MEMBERS.length)}
                </span>
              </div>
              
              <div className="flex items-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                <img 
                  src={beneficiary.avatar} 
                  alt={beneficiary.name} 
                  className="h-16 w-16 rounded-full border-4 border-white shadow-sm"
                />
                <div className="ml-4 flex-1">
                  <p className="text-sm text-orange-600 font-medium uppercase tracking-wide">Receiving this week</p>
                  <h3 className="text-2xl font-bold text-slate-800">{beneficiary.name}</h3>
                  <div className="flex items-center text-slate-600 mt-1 space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{beneficiary.phone}</span>
                  </div>
                </div>
                {allPaid && (
                  <button 
                    onClick={advanceWeek}
                    className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <span>Next Week</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Members List */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Weekly Contributions</h2>
            <div className="text-sm text-slate-500">
              <span className="font-medium text-slate-700">{Object.values(contributions).filter(s => s === 'completed').length}</span> of {INITIAL_MEMBERS.length} paid
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {INITIAL_MEMBERS.map((member) => {
              const status = contributions[member.id];
              const isPaid = status === 'completed';
              const isBeneficiary = member.id === beneficiary.id;

              return (
                <div key={member.id} className={cn("p-6 flex items-center justify-between transition-colors", isBeneficiary ? "bg-orange-50/30" : "hover:bg-slate-50")}>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img src={member.avatar} alt={member.name} className="h-12 w-12 rounded-full shadow-sm" />
                      {isBeneficiary && (
                        <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                          BEN
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 flex items-center space-x-2">
                        <span>{member.name}</span>
                        {isBeneficiary && <span className="text-xs font-normal text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Beneficiary</span>}
                      </h3>
                      <p className="text-sm text-slate-500">{member.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {isPaid ? (
                      <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="h-5 w-5 mr-1.5" />
                        <span className="text-sm font-medium">Paid {CONTRIBUTION_AMOUNT.toLocaleString()} FCFA</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePay(member)}
                        className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-orange-500/20"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Pay via Orange Money</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Orange Money Payment Modal */}
      {selectedMemberToPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Orange Header */}
            <div className="bg-[#ff6600] p-6 text-white text-center">
              <h3 className="text-2xl font-bold tracking-tight">Orange Money</h3>
              <p className="text-orange-100 text-sm mt-1">Secure Mobile Payment</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-slate-500">You are about to pay</p>
                <div className="text-3xl font-bold text-slate-800">{CONTRIBUTION_AMOUNT.toLocaleString()} FCFA</div>
                <p className="text-slate-500 text-sm">for Week {currentWeek} Contribution</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">From Member</span>
                  <span className="font-medium text-slate-800">{selectedMemberToPay.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">To Beneficiary</span>
                  <span className="font-medium text-slate-800">{beneficiary.name} ({beneficiary.phone})</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-200">
                  <span className="text-slate-500">Fee</span>
                  <span className="font-medium text-slate-800">0 FCFA</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-blue-50 text-blue-800 p-3 rounded-lg text-sm">
                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
                <p>This is a simulated transaction. In a real app, this would trigger an Orange Money USSD prompt or redirect to the payment gateway.</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setSelectedMemberToPay(null)}
                  disabled={isProcessingPayment}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={isProcessingPayment}
                  className="flex-1 px-4 py-2 bg-[#ff6600] hover:bg-[#e65c00] text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center disabled:opacity-70"
                >
                  {isProcessingPayment ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Confirm Payment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
