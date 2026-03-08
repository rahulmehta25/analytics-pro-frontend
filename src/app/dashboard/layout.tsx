import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import Link from "next/link";

const mobileNavItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/query", label: "Query" },
  { href: "/dashboard/connectors", label: "Connectors" },
  { href: "/dashboard/insights", label: "Insights" },
  { href: "/dashboard/rag-demo", label: "RAG Demo" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <nav className="mb-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
            {mobileNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
}
