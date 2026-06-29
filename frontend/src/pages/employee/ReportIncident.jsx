import { useNavigate } from 'react-router-dom';
import { useCreateIncident } from '../../hooks/useIncidents';
import IncidentForm from '../../components/incidents/IncidentForm';
import PageHeader from '../../components/common/PageHeader';
import toast from 'react-hot-toast';

export default function ReportIncident() {
  const navigate = useNavigate();
  const mutation = useCreateIncident();

  const handleSubmit = async (formData) => {
    try {
      const result = await mutation.mutateAsync(formData);
      toast.success('Incident reported and analyzed by AI');
      navigate(`/incidents/${result._id || result.incident?._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to report incident');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Report Safety Incident"
        description="Provide details about the incident. AI will analyze it automatically."
      />
      <IncidentForm onSubmit={handleSubmit} loading={mutation.isPending} />
    </div>
  );
}
