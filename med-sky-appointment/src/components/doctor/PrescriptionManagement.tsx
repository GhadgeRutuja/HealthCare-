import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Pill, 
  Plus, 
  Users, 
  Calendar, 
  Clock,
  FileText,
  Search,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { User as UserType } from '@/services/api';

interface PrescriptionManagementProps {
  doctor: UserType;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lastVisit?: string;
  avatar?: string;
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  notes?: string;
  prescribedDate: string;
  status: 'active' | 'completed' | 'cancelled';
}

const PrescriptionManagement: React.FC<PrescriptionManagementProps> = ({ doctor }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingPrescription, setIsAddingPrescription] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state for new prescription
  const [newPrescription, setNewPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    notes: ''
  });

  // Mock data for patients - in real app, this would come from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API calls
        // const patientsData = await api.getDoctorPatients(doctor.id);
        // const prescriptionsData = await api.getDoctorPrescriptions(doctor.id);
        
        // Mock patients data
        const mockPatients: Patient[] = [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '+1-555-0123',
            lastVisit: '2025-07-10',
            avatar: '/placeholder.svg'
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@email.com',
            phone: '+1-555-0124',
            lastVisit: '2025-07-08',
            avatar: '/placeholder.svg'
          }
        ];

        // Mock prescriptions data
        const mockPrescriptions: Prescription[] = [
          {
            id: '1',
            patientId: '1',
            patientName: 'John Doe',
            medication: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'Three times daily',
            duration: '7 days',
            instructions: 'Take with food',
            notes: 'For bacterial infection',
            prescribedDate: '2025-07-10',
            status: 'active'
          }
        ];

        setPatients(mockPatients);
        setPrescriptions(mockPrescriptions);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctor._id]);

  const filteredPatients = patients.filter(patient => 
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPrescription = async () => {
    if (!selectedPatient) return;

    try {
      const prescription: Prescription = {
        id: Date.now().toString(),
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        ...newPrescription,
        prescribedDate: new Date().toISOString().split('T')[0],
        status: 'active'
      };

      // TODO: Replace with actual API call
      // await api.createPrescription(prescription);
      
      setPrescriptions([...prescriptions, prescription]);
      setNewPrescription({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        notes: ''
      });
      setIsAddingPrescription(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error('Failed to add prescription:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prescription Management</h2>
          <p className="text-gray-600">Manage prescriptions for your patients</p>
        </div>
        <Dialog open={isAddingPrescription} onOpenChange={setIsAddingPrescription}>
          <DialogTrigger asChild>
            <Button className="bg-sky-600 hover:bg-sky-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Prescription</DialogTitle>
              <DialogDescription>
                Create a new prescription for your patient
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Patient Selection */}
              <div className="space-y-2">
                <Label htmlFor="patient-search">Select Patient</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="patient-search"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {searchTerm && (
                  <div className="max-h-40 overflow-y-auto border rounded-md">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                          selectedPatient?.id === patient.id ? 'bg-sky-50 border-sky-200' : ''
                        }`}
                        onClick={() => {
                          setSelectedPatient(patient);
                          setSearchTerm(`${patient.firstName} ${patient.lastName}`);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={patient.avatar} />
                            <AvatarFallback>
                              {patient.firstName[0]}{patient.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                            <p className="text-sm text-gray-500">{patient.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedPatient && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">Prescription Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="medication">Medication Name</Label>
                      <Input
                        id="medication"
                        value={newPrescription.medication}
                        onChange={(e) => setNewPrescription({...newPrescription, medication: e.target.value})}
                        placeholder="e.g., Amoxicillin"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input
                        id="dosage"
                        value={newPrescription.dosage}
                        onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                        placeholder="e.g., 500mg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select
                        value={newPrescription.frequency}
                        onValueChange={(value) => setNewPrescription({...newPrescription, frequency: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="once-daily">Once daily</SelectItem>
                          <SelectItem value="twice-daily">Twice daily</SelectItem>
                          <SelectItem value="three-times-daily">Three times daily</SelectItem>
                          <SelectItem value="four-times-daily">Four times daily</SelectItem>
                          <SelectItem value="as-needed">As needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={newPrescription.duration}
                        onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                        placeholder="e.g., 7 days"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={newPrescription.instructions}
                      onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                      placeholder="e.g., Take with food, avoid alcohol"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={newPrescription.notes}
                      onChange={(e) => setNewPrescription({...newPrescription, notes: e.target.value})}
                      placeholder="Any additional notes for the patient"
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="outline" onClick={() => setIsAddingPrescription(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddPrescription}
                      disabled={!newPrescription.medication || !newPrescription.dosage || !newPrescription.frequency}
                      className="bg-sky-600 hover:bg-sky-700"
                    >
                      Add Prescription
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recent Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pill className="h-5 w-5 mr-2 text-purple-600" />
            Recent Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {prescriptions.length > 0 ? (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-gray-900">{prescription.medication}</h3>
                        <Badge className={getStatusColor(prescription.status)}>
                          {prescription.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Patient:</strong> {prescription.patientName}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>Dosage:</strong> {prescription.dosage}
                        </div>
                        <div>
                          <strong>Frequency:</strong> {prescription.frequency}
                        </div>
                        <div>
                          <strong>Duration:</strong> {prescription.duration}
                        </div>
                        <div>
                          <strong>Date:</strong> {prescription.prescribedDate}
                        </div>
                      </div>
                      
                      {prescription.instructions && (
                        <p className="text-sm text-gray-700 mt-2">
                          <strong>Instructions:</strong> {prescription.instructions}
                        </p>
                      )}
                      
                      {prescription.notes && (
                        <p className="text-sm text-blue-600 mt-1">
                          <strong>Notes:</strong> {prescription.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions yet</h3>
              <p className="text-gray-600 mb-4">Start adding prescriptions for your patients</p>
              <Button onClick={() => setIsAddingPrescription(true)} className="bg-sky-600 hover:bg-sky-700">
                <Plus className="h-4 w-4 mr-2" />
                Add First Prescription
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionManagement;
