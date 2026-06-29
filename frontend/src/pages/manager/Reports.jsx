import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReactToPrint } from 'react-to-print';
import { getMonthlyReport, getDepartmentReport, getHighRiskReport } from '../../api/dashboardApi';
import { getAllDepartments } from '../../api/departmentApi';
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart';
import DepartmentChart from '../../components/charts/DepartmentChart';
import IncidentTable from '../../components/incidents/IncidentTable';
import PageHeader from '../../components/common/PageHeader';
import PrintableMonthlyReport from '../../components/reports/PrintableMonthlyReport';
import { useAuth } from '../../hooks/useAuth';
import { BarChart3, Download } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

export default function Reports() {
  const { user } = useAuth();
  const printRef = useRef(null);
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [deptId, setDeptId] = useState('');

  const { data: monthlyData, isLoading: monthlyLoading } = useQuery({
    queryKey: ['monthlyReport', month, year],
    queryFn: () => getMonthlyReport({ month, year }).then((r) => r.data.data),
  });

  const { data: deptReport, isLoading: deptLoading } = useQuery({
    queryKey: ['deptReport', deptId],
    queryFn: () => getDepartmentReport({ departmentId: deptId || undefined }).then((r) => r.data.data),
    enabled: !!deptId,
  });

  const { data: highRiskData, isLoading: highRiskLoading } = useQuery({
    queryKey: ['highRiskReport'],
    queryFn: () => getHighRiskReport({ threshold: 70 }).then((r) => r.data.data),
  });

  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getAllDepartments().then((r) => r.data.data),
  });

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: () => `SafeGuard-Monthly-Report-${year}-${month}`,
    pageStyle: '@page { size: A4 portrait; margin: 14mm 12mm 15mm; }',
    onPrintError: (location, error) => {
      console.error(`Unable to print report (${location})`, error);
      toast.error('Unable to print report.');
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="Reports & Analytics" description="Generate and view safety reports" />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">Monthly Safety Report</h2>
          <button onClick={handlePrint} disabled={!monthlyData || monthlyLoading} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:cursor-not-allowed disabled:opacity-50">
            <Download className="w-4 h-4" /> Print
          </button>
        </div>
        <div className="flex gap-4 mb-4">
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                {new Date(2024, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        {monthlyLoading ? (
          <div className="h-48 bg-slate-100 rounded-lg animate-pulse" />
        ) : monthlyData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-xs text-slate-500">Total</p>
                <p className="text-xl font-bold text-slate-900">{monthlyData.summary.total}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-xs text-slate-500">High Risk</p>
                <p className="text-xl font-bold text-red-600">{monthlyData.summary.highRiskCount}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-xs text-slate-500">Month</p>
                <p className="text-xl font-bold text-slate-900">{monthlyData.summary.month} {monthlyData.summary.year}</p>
              </div>
            </div>
            <MonthlyTrendChart data={monthlyData.chartData.map((d) => ({ _id: `Day ${d.day}`, count: d.count }))} />
          </div>
        ) : (
          <p className="text-sm text-slate-400 py-8 text-center">Select a month to view report</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Department Report</h2>
        <div className="mb-4">
          <select
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select a department</option>
            {(deptData || []).map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>
        {deptLoading ? (
          <div className="h-48 bg-slate-100 rounded-lg animate-pulse" />
        ) : deptId && deptReport ? (
          <div className="space-y-4">
            {deptReport.department && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Department</p>
                  <p className="text-sm font-bold text-slate-900">{deptReport.department.name}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="text-xl font-bold text-slate-900">{deptReport.summary.total}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Open</p>
                  <p className="text-xl font-bold text-amber-600">{deptReport.summary.openIncidents}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">High Risk</p>
                  <p className="text-xl font-bold text-red-600">{deptReport.summary.highRiskCount}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-400 py-8 text-center">Select a department to view report</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">High Risk Incidents (Risk Score ≥ 70)</h2>
        {highRiskLoading ? (
          <div className="h-48 bg-slate-100 rounded-lg animate-pulse" />
        ) : highRiskData?.incidents?.length > 0 ? (
          <IncidentTable incidents={highRiskData.incidents} />
        ) : (
          <p className="text-sm text-slate-400 py-8 text-center">No high risk incidents found.</p>
        )}
      </div>

      <PrintableMonthlyReport
        ref={printRef}
        data={monthlyData}
        month={month}
        year={year}
        generatedBy={user?.name}
      />
    </div>
  );
}
