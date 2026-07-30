"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FaHome,
  FaBuilding,
  FaMoneyBill,
  FaChartBar,
  FaSearch,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaFileImport,
} from "react-icons/fa";

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: FaHome,
  },
  {
    name: "Quick Collection",
    href: "/collection",
    icon: FaMoneyBill,
  },
  {
    name: "Buildings",
    href: "/buildings",
    icon: FaBuilding,
  },
  {
    name: "Flats",
    href: "/flats",
    icon: FaBuilding,
  },
  {
    name: "Search",
    href: "/search",
    icon: FaSearch,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FaChartBar,
  },
  {
    name: "Import Excel",
    href: "/import",
    icon: FaFileImport,
  },
  {
    name: "Activity",
    href: "/activity",
    icon: FaHistory,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: FaCog,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-blue-900 text-white min-h-screen flex flex-col">

      <div className="p-5 border-b border-blue-700">
        <h2 className="font-bold text-xl">
          UDAYAN
        </h2>

        <p className="text-sm text-blue-200">
          Subscription Management
        </p>
      </div>

      <nav className="flex-1 mt-4">

        {menu.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                isActive
                  ? "bg-blue-700 font-semibold"
                  : "hover:bg-blue-800"
              }`}
            >
              <Icon className="text-lg" />
              <span>{item.name}</span>
            </Link>
          );
        })}

      </nav>

      <div className="border-t border-blue-700 p-4">

        <button
          className="flex items-center gap-3 w-full px-2 py-2 hover:bg-blue-800 rounded"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </aside>
  );
}