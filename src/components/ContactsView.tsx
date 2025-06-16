import { useData } from '../contexts/DataContext';
import { Phone, User, Stethoscope, Ambulance } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ContactsViewProps {
  showAll?: boolean; // Whether to show all contacts or just those related to the user's patients
}

const ContactsView: React.FC<ContactsViewProps> = ({ showAll = false }) => {
  const { patients, doctors, caretakers } = useData();
  const { user } = useAuth();

  const relevantPatients = showAll || !user?.id 
    ? patients 
    : patients.filter(patient => patient.assignedCaretakers.includes(user.id));

  const emergencyContacts = [
    { name: 'Police Service', number: '100', icon: Ambulance, type: 'Emergency' },
    { name: 'Ambulance Service', number: '108', icon: Ambulance, type: 'Emergency' },
    { name: 'Hospital Front Desk', number: '044-22334455', icon: Phone, type: 'Main' },
    
  ];

  const relevantDoctorIds = showAll 
    ? doctors.map(d => d.id)
    : [...new Set(relevantPatients.map(p => p.doctorId))];
  
  const relevantDoctors = doctors.filter(doctor => relevantDoctorIds.includes(doctor.id));

  return (
    <div className="space-y-6">
      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Emergency Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <contact.icon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-red-800">{contact.name}</h3>
                  <div className="flex items-center gap-1 text-red-700">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${contact.number}`} className="font-mono text-lg hover:underline">{contact.number}</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctors */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Doctors {!showAll && '(Assigned to Your Patients)'}</h2>
        {relevantDoctors.length === 0 ? (
          <p className="text-gray-600 italic">No doctors assigned.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relevantDoctors.map((doctor) => {
              const assignedPatients = relevantPatients.filter(p => p.doctorId === doctor.id);
              return (
                <div key={doctor.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-blue-800">{doctor.name}</h3>
                      <p className="text-sm text-blue-600 mb-2">{doctor.specialization}</p>
                      <div className="flex items-center gap-1 text-blue-700 mb-2">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${doctor.phone}`} className="font-mono hover:underline">{doctor.phone}</a>
                      </div>
                      {assignedPatients.length > 0 && (
                        <div className="text-xs text-blue-600">
                          Patients: {assignedPatients.map(p => p.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Caretakers & Patient Emergency Contacts (for showAll) */}
      {showAll && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Caretakers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {caretakers.map((caretaker) => {
                const assignedPatients = patients.filter(p => p.assignedCaretakers.includes(caretaker.id));
                return (
                  <div key={caretaker.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-green-800">{caretaker.name}</h3>
                        <div className="flex items-center gap-1 text-green-700 mb-2">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${caretaker.phone}`} className="font-mono hover:underline">{caretaker.phone}</a>
                        </div>
                        <div className="text-xs text-green-600">
                          Patients: {assignedPatients.map(p => p.name).join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Patient Emergency Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patients.map((patient) => (
                <div key={patient.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-orange-800">{patient.name}</h3>
                      <div className="flex items-center gap-1 text-orange-700">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${patient.emergencyContact}`} className="font-mono hover:underline">{patient.emergencyContact}</a>
                      </div>
                      <p className="text-xs text-orange-600">{patient.condition}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Caretaker's Patient Emergency Contacts */}
      {!showAll && user?.role === 'caretaker' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Patients' Emergency Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relevantPatients.map((patient) => (
              <div key={patient.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-orange-800">{patient.name}</h3>
                    <div className="flex items-center gap-1 text-orange-700">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${patient.emergencyContact}`} className="font-mono hover:underline">{patient.emergencyContact}</a>
                    </div>
                    <p className="text-xs text-orange-600">{patient.condition}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsView;
