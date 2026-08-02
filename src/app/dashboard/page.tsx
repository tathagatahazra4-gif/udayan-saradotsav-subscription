"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { getDashboardStats } from "@/services/dashboardService";
import { getRecentPayments } from "@/services/recentPaymentsService";
import { getBuildingCollection } from "@/services/chartService";
import { getVolunteerCollectionReport } from "@/services/reportService";

import StatCard from "@/components/dashboard/StatCard";
import RecentPayments from "@/components/dashboard/RecentPayments";
import CollectionCharts from "@/components/dashboard/CollectionCharts";
import BuildingCollectionChart from "@/components/dashboard/BuildingCollectionChart";
import VolunteerCollectionChart from "@/components/dashboard/VolunteerCollectionChart";

import {
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaRupeeSign,
  FaCalendarDay,
  FaChartLine,
  FaSyncAlt,
  FaMoneyBillWave,
  FaSearch,
  FaFileExcel,
} from "react-icons/fa";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [buildingData, setBuildingData] = useState<any[]>([]);
  const [volunteerData, setVolunteerData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      setLoading(true);

      const dashboardData = await getDashboardStats();
      setStats(dashboardData);

      const payments = await getRecentPayments();
      setRecentPayments(payments);

      const buildings = await getBuildingCollection();
      setBuildingData(buildings);

      const volunteers =
        await getVolunteerCollectionReport();

      setVolunteerData(volunteers);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading || !stats) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex items-center justify-center h-[70vh]">
            <h2 className="text-2xl font-semibold">
              Loading Dashboard...
            </h2>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>

        <div className="space-y-8">

          {/* Welcome Banner */}

          <div className="bg-linear-to-r from-blue-700 to-indigo-700 rounded-2xl text-white shadow-lg p-8">

            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">

              <div>

                <h1 className="text-4xl font-bold">
                  Welcome to Udayan Saradotsav Samity
                </h1>

                <p className="mt-3 text-blue-100 text-lg">
                  Subscription Collection Management System
                </p>

              </div>

              <div className="text-right">

                <p className="text-blue-100">
                  Today's Date
                </p>

                <h2 className="text-2xl font-bold">
                  {today}
                </h2>

              </div>

            </div>

          </div>

          {/* Header */}

          <div className="flex flex-col lg:flex-row justify-between gap-5 lg:items-center">

            <div>

              <h2 className="text-3xl font-bold text-gray-800">
                Dashboard Overview
              </h2>

              <p className="text-gray-500 mt-1">
                View your collection statistics and recent activities.
              </p>

            </div>

            <button
              onClick={loadDashboard}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow font-semibold"
            >
              <FaSyncAlt />
              Refresh Dashboard
            </button>

          </div>

          {/* Quick Actions */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

            <Link
              href="/collection"
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col items-center"
            >
              <FaMoneyBillWave className="text-4xl text-green-600 mb-3" />
              <span className="font-semibold">
                Quick Collection
              </span>
            </Link>

            <Link
              href="/search"
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col items-center"
            >
              <FaSearch className="text-4xl text-blue-600 mb-3" />
              <span className="font-semibold">
                Search Flat
              </span>
            </Link>

            <Link
              href="/reports"
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col items-center"
            >
              <FaFileExcel className="text-4xl text-purple-600 mb-3" />
              <span className="font-semibold">
                Reports
              </span>
            </Link>

            <Link
              href="/buildings"
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col items-center"
            >
              <FaBuilding className="text-4xl text-orange-600 mb-3" />
              <span className="font-semibold">
                Buildings
              </span>
            </Link>

          </div>

          {/* KPI Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            <StatCard
              title="Total Flats"
              value={stats.totalFlats}
              color="bg-blue-600"
              icon={<FaBuilding />}
            />

            <StatCard
              title="Paid Flats"
              value={stats.paidFlats}
              color="bg-green-600"
              icon={<FaCheckCircle />}
            />

            <StatCard
              title="Pending Flats"
              value={stats.pendingFlats}
              color="bg-red-600"
              icon={<FaTimesCircle />}
            />

            <StatCard
              title="Total Collection"
              value={`₹${stats.totalCollection}`}
              color="bg-purple-600"
              icon={<FaRupeeSign />}
            />

            <StatCard
              title="Today's Collection"
              value={`₹${stats.todaysCollection}`}
              color="bg-orange-600"
              icon={<FaCalendarDay />}
            />

            <StatCard
              title="Collection %"
              value={`${stats.collectionPercentage}%`}
              color="bg-indigo-600"
              icon={<FaChartLine />}
            />

          </div>

          {/* Charts */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

            <div className="bg-white rounded-2xl shadow p-6">

              <h2 className="text-xl font-bold mb-5">
                Payment Status
              </h2>

              <CollectionCharts stats={stats} />

            </div>

            <div className="bg-white rounded-2xl shadow p-6">

              <h2 className="text-xl font-bold mb-5">
                Building-wise Collection
              </h2>

              <BuildingCollectionChart
                data={buildingData}
              />

            </div>

          </div>

          {/* Volunteer Collection */}

          <VolunteerCollectionChart
            data={volunteerData}
          />

          {/* Recent Payments */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-2xl font-bold mb-5">
              Recent Payments
            </h2>

            <RecentPayments
              payments={recentPayments}
            />

          </div>

        </div>

      </AppLayout>
    </ProtectedRoute>
  );
}