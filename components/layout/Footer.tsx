export function Footer() {
  return (
    <footer className="no-print border-t border-line bg-white">
      <div className="shell flex flex-col gap-1.5 py-4 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold text-ink">বাজার দর</span> —
          প্রতিদিনের বাজার দাম এক নজরে
        </p>
        <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
      </div>
    </footer>
  );
}
