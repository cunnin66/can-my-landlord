const RESOURCES = [
  {
    title: "Find a Tenant Rights Attorney",
    description: "Connect with lawyers who specialize in landlord-tenant law.",
    icon: "⚖️",
  },
  {
    title: "Local Legal Aid Organizations",
    description: "Free and low-cost legal help in your area.",
    icon: "🤝",
  },
  {
    title: "File a Complaint",
    description: "Learn how to report housing violations to local authorities.",
    icon: "📝",
  },
];

export default function ComingSoon() {
  return (
    <section className="bg-gray-50 py-14 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Coming Soon
          </h2>
          <p className="text-gray-500 text-sm">
            We&apos;re working on connecting you directly with legal help
            resources in your area.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {RESOURCES.map((resource) => (
            <div
              key={resource.title}
              className="relative bg-white rounded-xl border border-gray-200 p-5 text-center opacity-70"
            >
              <span className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">
                Coming Soon
              </span>
              <div className="text-3xl mb-3">{resource.icon}</div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {resource.title}
              </h3>
              <p className="text-gray-500 text-xs">{resource.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
