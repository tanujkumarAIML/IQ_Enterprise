import React from "react";

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";

    case "In Progress":
      return "bg-yellow-100 text-yellow-700";

    case "Pending":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

const InterviewTable = ({ interviews = [] }) => {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-5 py-3 text-left text-sm font-semibold">
              Candidate
            </th>

            <th className="px-5 py-3 text-left text-sm font-semibold">
              Job Role
            </th>

            <th className="px-5 py-3 text-left text-sm font-semibold">
              Company
            </th>

            <th className="px-5 py-3 text-center text-sm font-semibold">
              Score
            </th>

            <th className="px-5 py-3 text-center text-sm font-semibold">
              Status
            </th>

            <th className="px-5 py-3 text-center text-sm font-semibold">
              Date
            </th>

          </tr>

        </thead>

        <tbody>

          {interviews.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                className="py-8 text-center text-slate-500"
              >
                No Interviews Found
              </td>

            </tr>

          ) : (

            interviews.map((item) => (

              <tr
                key={item._id}
                className="border-b hover:bg-slate-50"
              >

                <td className="px-5 py-4">

                  <div>

                    <p className="font-semibold">

                      {item.user?.name || "Unknown"}

                    </p>

                    <p className="text-sm text-slate-500">

                      {item.user?.email}

                    </p>

                  </div>

                </td>

                <td className="px-5 py-4">

                  {item.jobRole}

                </td>

                <td className="px-5 py-4">

                  {item.company || "-"}

                </td>

                <td className="px-5 py-4 text-center">

                  <span className="font-bold text-violet-600">

                    {item.overallScore || 0}

                  </span>

                </td>

                <td className="px-5 py-4 text-center">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>

                </td>

                <td className="px-5 py-4 text-center">

                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
};

export default InterviewTable;