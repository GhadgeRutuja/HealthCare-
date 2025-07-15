import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  User, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Clock,
  FileText,
  Pill,
  Eye,
  Edit3,
  Plus,
  Filter,
  Download,
  AlertCircle,
  Activity,
  Heart,
  Users,
  Loader2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { User as UserType } from '@/services/api';

interface PatientManagementProps {
  user: UserType;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: {
    allergies: string[];
    chronicConditions: string[];
    medications: string[];
    bloodType: string;
    lastVisit: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  totalAppointments: number;
  lastAppointment: string;
  nextAppointment?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

const PatientManagement: React.FC<PatientManagementProps> = ({ user }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await api.getDoctorPatients(user._id);
        
        // Mock data - will be replaced with real API
        const mockPatients: Patient[] = [];
        
        setPatients(mockPatients);
        setFilteredPatients(mockPatients);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user._id]);

  // Filter patients
  useEffect(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient => 
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient => patient.status === statusFilter);
    }

    setFilteredPatients(filtered);
  }, [patients, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
          <p className="text-gray-600">Manage your patient records and information</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showNewPatient} onOpenChange={setShowNewPatient}>
            <DialogTrigger asChild>
              <Button className="bg-sky-600 hover:bg-sky-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Enter patient information to create a new record
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  New patient registration form will be implemented here.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="status-filter" className="text-sm font-medium">
            Status:
          </Label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Patients List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Your Patients ({filteredPatients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading patients...</p>
            </div>
          ) : filteredPatients.length > 0 ? (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={patient.avatar} />
                          <AvatarFallback className="text-lg">
                            {patient.firstName[0]}{patient.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </h3>
                            <Badge className={getStatusColor(patient.status)}>
                              {patient.status}
                            </Badge>
                            <Badge className={getRiskColor(patient.riskLevel)}>
                              {patient.riskLevel} risk
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="h-4 w-4 mr-2" />
                              <span>Age: {calculateAge(patient.dateOfBirth)}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>{patient.phone}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              <span className="truncate">{patient.email}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>Last visit: {patient.lastAppointment}</span>
                            </div>
                            <div className="flex items-center">
                              <Activity className="h-4 w-4 mr-2" />
                              <span>Total visits: {patient.totalAppointments}</span>
                            </div>
                          </div>

                          {patient.medicalHistory.chronicConditions.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Chronic Conditions:</p>
                              <div className="flex flex-wrap gap-1">
                                {patient.medicalHistory.chronicConditions.map((condition, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {condition}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewPatient(patient)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedPatient(
                            expandedPatient === patient.id ? null : patient.id
                          )}
                        >
                          {expandedPatient === patient.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedPatient === patient.id && (
                    <div className="border-t bg-gray-50 p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Medical Information</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Blood Type:</span> {patient.medicalHistory.bloodType}
                            </div>
                            {patient.medicalHistory.allergies.length > 0 && (
                              <div>
                                <span className="font-medium">Allergies:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {patient.medicalHistory.allergies.map((allergy, index) => (
                                    <Badge key={index} variant="destructive" className="text-xs">
                                      {allergy}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {patient.medicalHistory.medications.length > 0 && (
                              <div>
                                <span className="font-medium">Current Medications:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {patient.medicalHistory.medications.map((medication, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {medication}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                              <div>
                                <div>{patient.address.street}</div>
                                <div>{patient.address.city}, {patient.address.state} {patient.address.zipCode}</div>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Emergency Contact:</span>
                              <div className="ml-6 mt-1">
                                <div>{patient.emergencyContact.name} ({patient.emergencyContact.relationship})</div>
                                <div>{patient.emergencyContact.phone}</div>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Insurance:</span>
                              <div className="ml-6 mt-1">
                                <div>{patient.insurance.provider}</div>
                                <div>Policy: {patient.insurance.policyNumber}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="h-20 w-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No matching patients found' 
                  : 'No patients yet'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start building your patient base by adding new patients'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button 
                  onClick={() => setShowNewPatient(true)}
                  className="bg-sky-600 hover:bg-sky-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Patient
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Details Modal */}
      <Dialog open={showPatientDetails} onOpenChange={setShowPatientDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>
              Complete patient information and medical history
            </DialogDescription>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedPatient.avatar} />
                  <AvatarFallback className="text-xl">
                    {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold">{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                  <p className="text-gray-600">Age: {calculateAge(selectedPatient.dateOfBirth)} • {selectedPatient.gender}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(selectedPatient.status)}>
                      {selectedPatient.status}
                    </Badge>
                    <Badge className={getRiskColor(selectedPatient.riskLevel)}>
                      {selectedPatient.riskLevel} risk
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Personal Information</h4>
                  <div className="space-y-3 text-sm">
                    <div><strong>Email:</strong> {selectedPatient.email}</div>
                    <div><strong>Phone:</strong> {selectedPatient.phone}</div>
                    <div><strong>Date of Birth:</strong> {selectedPatient.dateOfBirth}</div>
                    <div><strong>Address:</strong> {selectedPatient.address.street}, {selectedPatient.address.city}, {selectedPatient.address.state} {selectedPatient.address.zipCode}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">Medical Summary</h4>
                  <div className="space-y-3 text-sm">
                    <div><strong>Blood Type:</strong> {selectedPatient.medicalHistory.bloodType}</div>
                    <div><strong>Last Visit:</strong> {selectedPatient.lastAppointment}</div>
                    <div><strong>Total Appointments:</strong> {selectedPatient.totalAppointments}</div>
                    {selectedPatient.nextAppointment && (
                      <div><strong>Next Appointment:</strong> {selectedPatient.nextAppointment}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Allergies</h4>
                  {selectedPatient.medicalHistory.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.medicalHistory.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">No known allergies</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">Chronic Conditions</h4>
                  {selectedPatient.medicalHistory.chronicConditions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.medicalHistory.chronicConditions.map((condition, index) => (
                        <Badge key={index} variant="secondary">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">No chronic conditions</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">Current Medications</h4>
                  {selectedPatient.medicalHistory.medications.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.medicalHistory.medications.map((medication, index) => (
                        <Badge key={index} variant="outline">
                          {medication}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">No current medications</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Emergency Contact</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedPatient.emergencyContact.name}</div>
                    <div><strong>Relationship:</strong> {selectedPatient.emergencyContact.relationship}</div>
                    <div><strong>Phone:</strong> {selectedPatient.emergencyContact.phone}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">Insurance Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Provider:</strong> {selectedPatient.insurance.provider}</div>
                    <div><strong>Policy Number:</strong> {selectedPatient.insurance.policyNumber}</div>
                    <div><strong>Group Number:</strong> {selectedPatient.insurance.groupNumber}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Records
                </Button>
                <Button variant="outline">
                  <Pill className="h-4 w-4 mr-2" />
                  Prescriptions
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Patient
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientManagement;
