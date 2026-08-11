"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { getBuildingFlats } from "@/services/buildingService";

import {
  getBuildingComment,
  saveBuildingComment,
} from "@/services/buildingCommentService";

export default function BuildingDetailsPage() {
  const { building } = useParams();

  const [flats, setFlats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  // Building Comments
  const [buildingComment, setBuildingComment] = useState("");
  const [commentUpdatedBy, setCommentUpdatedBy] = useState("");
  const [commentUpdatedAt, setCommentUpdatedAt] = useState<string | null>(
    null
  );
  const [savingComment, setSavingComment] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const buildingName = decodeURIComponent(
          building as string
        );

        const data = await getBuildingFlats(
          buildingName
        );

        setFlats(data);

        const commentData =
          await getBuildingComment(
            buildingName
          );

        setBuildingComment(
          commentData.comments ?? ""
        );

        setCommentUpdatedBy(
          commentData.updated_by ?? ""
        );

        setCommentUpdatedAt(
          commentData.updated_at ?? null
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (building) {
      load();
    }
  }, [building]);

  async function handleSaveComment() {
    try {
      setSavingComment(true);

      const buildingName = decodeURIComponent(
        building as string
      );

      const result =
        await saveBuildingComment(
          buildingName,
          buildingComment
        );

      setBuildingComment(
        result.comments ?? ""
      );

      setCommentUpdatedBy(
        result.updated_by ?? ""
      );

      setCommentUpdatedAt(
        result.updated_at ?? null
      );

      alert(
        "Building comments saved successfully."
      );
    } catch (err: any) {
      console.error(err);

      alert(
        err?.message ||
          "Failed to save building comments."
      );
    } finally {
      setSavingComment(false);
    }
  }

  const filteredFlats = useMemo(() => {
    return flats.filter((flat) => {
      const matchesSearch =
        flat.flat_number
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        flat.owner_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        flat.mobile_number
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        flat.comments
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "All" ||
        flat.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [flats, search, status]);

  const totalFlats = flats.length;

  const paidFlats = flats.filter(
    (flat) => flat.status === "Paid"
  ).length;

  const pendingFlats =
    totalFlats - paidFlats;

  const totalCollection = flats
    .filter(
      (flat) => flat.status === "Paid"
    )
    .reduce(
      (sum, flat) =>
        sum +
        Number(
          flat.subscription_amount || 0
        ),
      0
    );

  const collectionPercentage =
    totalFlats === 0
      ? 0
      : Math.round(
          (paidFlats / totalFlats) *
            100
        );

  function formatUpdatedDate(
    date: string | null
  ) {
    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="p-8 text-xl font-semibold">
            Loading Building...
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-8">

          {/* Header */}

          <div>
            <h1 className="text-4xl font-bold">
              Building {building}
            </h1>

            <p className="text-gray-500 mt-2">
              Building Overview
            </p>
          </div>

          {/* Summary Cards */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

            <div className="bg-blue-600 text-white rounded-xl p-5 shadow">
              <p>
                Total Flats
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {totalFlats}
              </h2>
            </div>

            <div className="bg-green-600 text-white rounded-xl p-5 shadow">
              <p>
                Paid Flats
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {paidFlats}
              </h2>
            </div>

            <div className="bg-red-600 text-white rounded-xl p-5 shadow">
              <p>
                Pending Flats
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {pendingFlats}
              </h2>
            </div>

            <div className="bg-purple-600 text-white rounded-xl p-5 shadow">
              <p>
                Collection
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ₹
                {totalCollection}
              </h2>
            </div>

          </div>

          {/* Collection Progress */}

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex justify-between items-center mb-2">

              <h2 className="font-bold text-lg">
                Collection Progress
              </h2>

              <span className="font-semibold">
                {
                  collectionPercentage
                }
                %
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">

              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${collectionPercentage}%`,
                }}
              />

            </div>

          </div>

          {/* Building Comments */}

          <div className="bg-white rounded-xl shadow p-6">

            <div className="mb-4">

              <h2 className="text-xl font-bold text-blue-900">
                Building Comments
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Use this section to record flats
                that are locked, vacant, have no
                owner available, or require a
                follow-up visit.
              </p>

            </div>

            <textarea
              rows={5}
              value={buildingComment}
              onChange={(e) =>
                setBuildingComment(
                  e.target.value
                )
              }
              placeholder={
                "Example:\n01B - Locked\n02C - Owner out of station\n03B - Vacant flat"
              }
              className="w-full border rounded-xl p-4 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">

              <div className="text-sm text-gray-500">

                {commentUpdatedBy ? (
                  <>
                    <p>
                      Last updated by:{" "}
                      <span className="font-semibold text-gray-700">
                        {
                          commentUpdatedBy
                        }
                      </span>
                    </p>

                    {commentUpdatedAt && (
                      <p className="mt-1">
                        Updated:{" "}
                        {
                          formatUpdatedDate(
                            commentUpdatedAt
                          )
                        }
                      </p>
                    )}
                  </>
                ) : (
                  <p>
                    No comments have been added
                    yet.
                  </p>
                )}

              </div>

              <button
                type="button"
                onClick={
                  handleSaveComment
                }
                disabled={
                  savingComment
                }
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                {savingComment
                  ? "Saving..."
                  : "Save Comments"}
              </button>

            </div>

          </div>

          {/* Search + Status Filter */}

          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="text"
              placeholder="Search Flat / Owner / Mobile / Comments"
              className="border rounded-lg p-3 flex-1"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <select
              className="border rounded-lg p-3 w-full md:w-48"
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
            >
              <option>
                All
              </option>

              <option>
                Paid
              </option>

              <option>
                Pending
              </option>
            </select>

          </div>

          {/* Flats Table */}

          <div className="bg-white rounded-xl shadow overflow-x-auto">

            <table className="min-w-[1150px] w-full">

              <thead className="bg-blue-900 text-white">

                <tr>

                  <th className="p-4 text-left">
                    Flat
                  </th>

                  <th className="p-4 text-left">
                    Owner
                  </th>

                  <th className="p-4 text-left">
                    Mobile
                  </th>

                  <th className="p-4 text-center">
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Amount
                  </th>

                  <th className="p-4 text-left">
                    Action
                  </th>

                  <th className="p-4 text-left min-w-[280px]">
                    Comments
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredFlats.map(
                  (flat) => (

                    <tr
                      key={
                        flat.flat_number
                      }
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="p-4 font-semibold whitespace-nowrap">
                        {
                          flat.flat_number
                        }
                      </td>

                      <td className="p-4">
                        {flat.owner_name ||
                          "-"}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {flat.mobile_number ||
                          "-"}
                      </td>

                      <td className="p-4 text-center">

                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${
                            flat.status ===
                            "Paid"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        >
                          {
                            flat.status
                          }
                        </span>

                      </td>

                      <td className="p-4 text-center whitespace-nowrap">
                        ₹
                        {
                          flat.subscription_amount
                        }
                      </td>

                      <td className="p-4 text-left whitespace-nowrap">

                        <Link
                          href={`/flats/${flat.flat_number}?fromBuilding=${encodeURIComponent(
                            building as string
                          )}`}
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                          Edit
                        </Link>

                      </td>

                      <td className="p-4 min-w-[280px] whitespace-normal align-top text-gray-700">
                        {flat.comments?.trim()
                          ? flat.comments
                          : "-"}
                      </td>

                    </tr>

                  )
                )}

                {filteredFlats.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center p-8 text-gray-500"
                    >
                      No flats found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}