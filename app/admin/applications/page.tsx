import ApplicationsTable from "@/components/admin/ApplicationsTable";

export default function ApplicationsPage() {
  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold" style={{ fontSize: "1.5rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>
            Applications
          </h1>
          <p className="text-sm font-body mt-0.5" style={{ color: "var(--mid)" }}>
            All NIN enrollment applications
          </p>
        </div>
      </div>
      <ApplicationsTable />
    </div>
  );
}
