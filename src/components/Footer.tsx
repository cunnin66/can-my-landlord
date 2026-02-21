export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-6 px-4">
      <div className="max-w-3xl mx-auto text-center text-xs text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} Can My Landlord...? &mdash; All
          information is for educational purposes only and does not constitute
          legal advice.
        </p>
      </div>
    </footer>
  );
}
