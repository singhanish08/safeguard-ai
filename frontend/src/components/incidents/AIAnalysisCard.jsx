import { Sparkles, AlertTriangle, Shield, Stethoscope, FlaskConical, ClipboardList } from 'lucide-react';
import RiskScoreRing from '../common/RiskScoreRing';
import SeverityBadge from '../common/SeverityBadge';

export default function AIAnalysisCard({ analysis }) {
  if (!analysis || !analysis.isGenerated) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-200" />
            <h3 className="text-white font-semibold">AI Safety Analysis</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800">
              AI analysis was not available for this incident. Please review manually.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-200" />
          <h3 className="text-white font-semibold">AI Safety Analysis</h3>
        </div>
      </div>
      <div className="p-6 space-y-5">

        <div className="flex items-center gap-4 mb-4">
          <RiskScoreRing score={analysis.riskScore} size={90} />
          <div>
            <p className="text-xs text-slate-500 mb-1">Severity</p>
            <SeverityBadge severity={analysis.severityLevel} />
            <p className="text-xs text-slate-500 mt-2">Category: <span className="text-slate-700 font-medium">{analysis.category}</span></p>
          </div>
        </div>

        {analysis.executiveSummary && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-900 dark:text-indigo-100 leading-relaxed">
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-widest mb-1">Executive Summary</p>
            {analysis.executiveSummary}
          </div>
        )}

        <Section icon={AlertTriangle} title="Root Causes" items={analysis.rootCauses} color="text-red-600" />
        <Section icon={ClipboardList} title="Immediate Actions" items={analysis.immediateActions} color="text-amber-600" />
        <Section icon={Shield} title="Preventive Measures" items={analysis.preventiveMeasures} color="text-emerald-600" />

        {analysis.requiredPPE?.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">Required PPE</p>
            <div className="flex flex-wrap gap-2">
              {analysis.requiredPPE.map((ppe, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{ppe}</span>
              ))}
            </div>
          </div>
        )}

        {analysis.environmentalImpact && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-slate-400" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Environmental Impact</p>
            </div>
            <p className="text-sm text-slate-700">{analysis.environmentalImpact}</p>
          </div>
        )}

        {analysis.recommendedInvestigation && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recommended Investigation</p>
            </div>
            <p className="text-sm text-slate-700">{analysis.recommendedInvestigation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, items, color }) {
  if (!items?.length) return null;
  return (
    <div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        {title}
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="text-slate-300 mt-1">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
