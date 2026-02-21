const QUICK_ACTIONS = [
  { label: "How do I get out of my lease?", icon: "📋" },
  { label: "My landlord is charging me for damage", icon: "🔧" },
  { label: "My landlord is trying to kick me out", icon: "🏠" },
];

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function QuickActionButtons({ onSend, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.label}
          onClick={() => onSend(action.label)}
          disabled={disabled}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
