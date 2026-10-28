"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BiErrorCircle, BiTrash, BiX } from "react-icons/bi";
import { getAdminReports, dismissReport, removeReportedListing } from "@/lib/api";

const truncateId = (id) => {
  if (!id) return "—";
  const str = typeof id === "object" && id?.$oid ? id.$oid : String(id);
  return str.length > 8 ? `${str.slice(0, 8)}...` : str;
};

const formatDate = (value) => {
  if (!value) return "—";
  const raw = typeof value === "object" && value?.$date ? value.$date : value;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB"); 
};

export default function ListingReportsPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAdminReports("pending");
      setReports(data?.success ? data.reports : []);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDismiss = async (reportId) => {
    setActioningId(reportId);
    try {
      await dismissReport(reportId);
      setReports((prev) => prev.filter((r) => (r._id?.$oid || r._id) !== reportId));
    } catch (error) {
      console.error("Failed to dismiss report:", error);
      alert("Failed to dismiss report. Please try again.");
    } finally {
      setActioningId(null);
    }
  };

  const handleRemoveListing = async (reportId) => {
    setActioningId(reportId);
    try {
      await removeReportedListing(reportId);
      setReports((prev) => prev.filter((r) => (r._id?.$oid || r._id) !== reportId));
      setConfirmRemove(null);
    } catch (error) {
      console.error("Failed to remove listing:", error);
      alert("Failed to remove listing. Please try again.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="p-6 md:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold flex items-center gap-2">
          Listing Reports <BiErrorCircle className="text-red-500 w-7 h-7" />
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          {reports.length} pending report{reports.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Listing ID</th>
                <th className="px-6 py-4 font-semibold">Reporter</th>
                <th className="px-6 py-4 font-semibold">Reason</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Reported</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">

              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
                  </td>
                </tr>
              ) : reports.length > 0 ? (
                reports.map((report, index) => {
                  const reportId = report._id?.$oid || report._id;
                  const isActioning = actioningId === reportId;

                  return (
                    <tr key={reportId || index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-gray-400">
                        {truncateId(report.listingId)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {report.reporterEmail || report.reporter || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          {report.reason || "Other"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-s text-center">
                        {report.description || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(report.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setConfirmRemove(report)}
                            disabled={isActioning}
                            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors disabled:opacity-50"
                          >
                            Remove Listing
                          </button>
                          <button
                            onClick={() => handleDismiss(reportId)}
                            disabled={isActioning}
                            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 transition-colors disabled:opacity-50"
                          >
                            {isActioning ? "..." : "Dismiss"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                    No pending reports.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Remove Modal */}
      {confirmRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-red-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <BiTrash className="text-red-600 w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-gray-900">Remove Listing</h2>
              </div>
              <button
                onClick={() => setConfirmRemove(null)}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
                aria-label="Close"
              >
                <BiX className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-6 text-center space-y-1.5">
              <p className="text-gray-900 font-semibold text-sm">
                Permanently remove this reported listing?
              </p>
              <p className="text-gray-500 text-sm">
                Listing ID {truncateId(confirmRemove.listingId)} will be deleted, and all reports
                tied to it will be marked resolved. This cannot be undone.
              </p>
            </div>

            <div className="px-6 pb-6 flex gap-2">
              <button
                onClick={() => setConfirmRemove(null)}
                className="flex-1 px-5 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveListing(confirmRemove._id?.$oid || confirmRemove._id)}
                disabled={actioningId === (confirmRemove._id?.$oid || confirmRemove._id)}
                className="flex-1 px-5 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-60"
              >
                {actioningId ? "Removing…" : "Remove Listing"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}