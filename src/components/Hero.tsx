export default function Hero() {
  return (
    <section className="bg-indigo-700 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Can My Landlord...?
        </h1>
        <p className="text-lg sm:text-xl text-indigo-100 mb-10">
          Upload your lease and ask questions about your tenant rights.
          <br className="hidden sm:block" />
          Powered by AI, informed by the law.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="bg-indigo-600/50 rounded-xl p-5">
            <div className="text-2xl mb-2">1</div>
            <p className="font-semibold mb-1">Upload Your Lease</p>
            <p className="text-indigo-200">
              Or tell us your city and state for general guidance
            </p>
          </div>
          <div className="bg-indigo-600/50 rounded-xl p-5">
            <div className="text-2xl mb-2">2</div>
            <p className="font-semibold mb-1">Ask a Question</p>
            <p className="text-indigo-200">
              Ask anything about your rights as a tenant
            </p>
          </div>
          <div className="bg-indigo-600/50 rounded-xl p-5">
            <div className="text-2xl mb-2">3</div>
            <p className="font-semibold mb-1">Get Answers</p>
            <p className="text-indigo-200">
              Understand your rights with clear, sourced information
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
