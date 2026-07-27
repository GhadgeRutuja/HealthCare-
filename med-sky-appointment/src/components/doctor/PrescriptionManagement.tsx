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
import { User as UserType, appointmentsApi, Appointment } from '@/services/api';

interface PrescriptionManagementProps {
  doctor: UserType;
}

interface AppointmentSelect {
  id: string;
  patientName: string;
  patientEmail: string;
  date: string;
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
  const [appointmentsList, setAppointmentsList] = useState<AppointmentSelect[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentSelect | null>(null);
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

  // Fetch real appointments to get patients and past prescriptions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await appointmentsApi.getAll();
        if (res.success) {
          const apts = res.data;
          
          // Map to dropdown selection
          const selectList: AppointmentSelect[] = apts.map((apt: any) => ({
            id: apt._id,
            patientName: `${apt.patient?.firstName} ${apt.patient?.lastName}`,
            patientEmail: apt.patient?.email,
            date: new Date(apt.appointmentDate).toLocaleDateString(),
            avatar: apt.patient?.profileImage
          }));
          setAppointmentsList(selectList);

          // Map existing prescriptions
          const existingPrescriptions: Prescription[] = [];
          apts.forEach((apt: any) => {
            if (apt.prescription && apt.prescription.medications && apt.prescription.medications.length > 0) {
              apt.prescription.medications.forEach((med: any, index: number) => {
                existingPrescriptions.push({
                  id: `${apt._id}-${index}`,
                  patientId: apt.patient?._id,
                  patientName: `${apt.patient?.firstName} ${apt.patient?.lastName}`,
                  medication: med.name,
                  dosage: med.dosage,
                  frequency: med.frequency,
                  duration: med.duration,
                  instructions: med.instructions,
                  notes: apt.prescription.notes,
                  prescribedDate: new Date(apt.updatedAt || apt.appointmentDate).toLocaleDateString(),
                  status: 'active'
                });
              });
            }
          });
          setPrescriptions(existingPrescriptions);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctor._id]);

  const filteredAppointments = appointmentsList.filter(apt => 
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.patientEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPrescription = async () => {
    if (!selectedAppointment) return;

    try {
      const payload = {
        medications: [{
          name: newPrescription.medication,
          dosage: newPrescription.dosage,
          frequency: newPrescription.frequency,
          duration: newPrescription.duration,
          instructions: newPrescription.instructions
        }],
        notes: newPrescription.notes
      };

      const res = await appointmentsApi.addPrescription(selectedAppointment.id, payload);
      
      if (res.success) {
        // Add to local state to reflect immediately
        const addedPrescription: Prescription = {
          id: Date.now().toString(),
          patientId: selectedAppointment.id, // Just for UI keying
          patientName: selectedAppointment.patientName,
          ...newPrescription,
          prescribedDate: new Date().toLocaleDateString(),
          status: 'active'
        };
        
        setPrescriptions([addedPrescription, ...prescriptions]);
        
        setNewPrescription({
          medication: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
          notes: ''
        });
        setIsAddingPrescription(false);
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error('Failed to add prescription:', error);
      alert('Failed to save prescription.');
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
                <Label htmlFor="patient-search">Select Patient Appointment</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="patient-search"
                    placeholder="Search by patient name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {searchTerm && (
                  <div className="max-h-40 overflow-y-auto border rounded-md">
                    {filteredAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                          selectedAppointment?.id === apt.id ? 'bg-sky-50 border-sky-200' : ''
                        }`}
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setSearchTerm(`${apt.patientName} (Apt: ${apt.date})`);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={apt.avatar} />
                            <AvatarFallback>
                              {apt.patientName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{apt.patientName}</p>
                            <p className="text-xs text-gray-500">Apt Date: {apt.date} | {apt.patientEmail}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedAppointment && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">Prescription Details for {selectedAppointment.patientName}</h4>
                  
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
