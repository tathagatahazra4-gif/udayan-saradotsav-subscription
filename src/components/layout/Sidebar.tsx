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
  FaTimes,
  FaClipboardList,
  FaCalendarDay,
  FaHandHoldingHeart,
  FaBullhorn,
  FaLandmark,
} from "react-icons/fa";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

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
    name: "My Collections",
    href: "/my-collections",
    icon: FaClipboardList,
  },
  {
    name: "Daily Collection",
    href: "/daily-collection",
    icon: FaCalendarDay,
  },
  {
    name: "Donations",
    href: "/donations",
    icon: FaHandHoldingHeart,
  },
  {
    name: "Sponsors",
    href: "/sponsors",
    icon: FaBullhorn,
  },
  {
    name: "Government Grants",
    href: "/government-grants",
    icon: FaLandmark,
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

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}

      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      />

      {/* Sidebar */}

      <aside
        className={`
          fixed md:static
          top-0 left-0
          z-50
          h-screen
          w-64
          bg-blue-900
          text-white
          flex flex-col
          transform
          transition-transform
          duration-300
          shrink-0

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Header */}

        <div className="p-5 border-b border-blue-700">
          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-bold text-2xl">
                UDAYAN
              </h2>

              <p className="text-blue-200 text-sm mt-1">
                Subscription Management
              </p>
            </div>

            {/* Mobile Close Button */}

            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-lg hover:bg-blue-800 transition"
              aria-label="Close menu"
            >
              <FaTimes className="text-lg" />
            </button>

          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 mt-3 overflow-y-auto">

          {menu.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(
                item.href + "/"
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex
                  items-center
                  gap-4
                  px-5
                  py-4
                  transition-colors
                  whitespace-nowrap
                  ${
                    isActive
                      ? "bg-blue-700 font-semibold"
                      : "hover:bg-blue-800"
                  }
                `}
              >
                <Icon className="text-xl shrink-0" />

                <span className="text-base">
                  {item.name}
                </span>
              </Link>
            );
          })}

        </nav>

        {/* Logout */}

        <div className="border-t border-blue-700 p-4">

          <button
            className="
              flex
              items-center
              gap-3
              w-full
              px-3
              py-3
              rounded
              hover:bg-blue-800
              transition
            "
          >
            <FaSignOutAlt />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>
    </>
  );
}