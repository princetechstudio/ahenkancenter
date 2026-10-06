import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/Layout';
import { playersDB } from '../store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export const PlayerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEdit = !!editId;

  const [form, setForm] = useState({
    fullName: '', dateOfBirth: '', gender: 'Male' as 'Male' | 'Female', nationality: 'Ghanaian',
    ageGroup: 'U-14' as 'U-8' | 'U-10' | 'U-12' | 'U-14' | 'U-15' | 'U-17', position: 'Midfielder', preferredFoot: 'Right' as 'Right' | 'Left' | 'Both',
    jerseyNumber: 0, phone: '', status: 'Active' as 'Active' | 'Inactive' | 'Injured' | 'Trial',
    parentName: '', parentPhone: '', parentEmail: '', parentRelation: 'Father',
    emergencyName: '', emergencyPhone: '', emergencyRelation: '',
    school: '', className: '', academicPerformance: 'Good',
    bloodGroup: 'O+', allergies: 'None', medicalConditions: 'None',
    address: '', city: 'Adeiso', region: 'Eastern', dateJoined: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editId) {
      const player = playersDB.getById(editId);
      if (player) {
        setForm({
          fullName: player.fullName, dateOfBirth: player.dateOfBirth, gender: player.gender,
          nationality: player.nationality, ageGroup: player.ageGroup, position: player.position,
          preferredFoot: player.preferredFoot, jerseyNumber: player.jerseyNumber, phone: player.phone || '',
          status: player.status, parentName: player.parentName, parentPhone: player.parentPhone,
          parentEmail: player.parentEmail, parentRelation: player.parentRelation,
          emergencyName: player.emergencyName, emergencyPhone: player.emergencyPhone,
          emergencyRelation: player.emergencyRelation, school: player.school, className: player.className,
          academicPerformance: player.academicPerformance, bloodGroup: player.bloodGroup,
          allergies: player.allergies, medicalConditions: player.medicalConditions,
          address: player.address, city: player.city, region: player.region, dateJoined: player.dateJoined,
        });
      }
    }
  }, [editId]);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.dateOfBirth || !form.parentName || !form.parentPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isEdit && editId) {
      playersDB.update(editId, form);
      toast.success('Player updated successfully!');
    } else {
      playersDB.create({
        ...form,
        overallRating: 5.0, attendanceRate: 0, goals: 0, assists: 0,
        technical: 5.0, physical: 5.0, tactical: 5.0, mental: 5.0,
      } as any);
      toast.success('Player registered successfully!');
    }
    navigate('/players');
  };

  const InputField: React.FC<{ label: string; field: string; type?: string; required?: boolean; placeholder?: string }> = ({ label, field, type = 'text', required, placeholder }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <input type={type} value={(form as any)[field]} onChange={e => handleChange(field, e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" required={required} />
    </div>
  );

  const SelectField: React.FC<{ label: string; field: string; options: string[]; required?: boolean }> = ({ label, field, options, required }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <select value={(form as any)[field]} onChange={e => handleChange(field, e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" required={required}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Player' : 'Register New Player'}</h1>
          <p className="text-sm text-gray-500">{isEdit ? 'Update player information' : 'Fill in the details to register a new player'}</p>
        </div>
        <button onClick={() => navigate('/players')} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Camera size={18} /> Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField label="Full Name" field="fullName" required placeholder="Enter full name" />
            <InputField label="Date of Birth" field="dateOfBirth" type="date" required />
            <SelectField label="Gender" field="gender" options={['Male', 'Female']} required />
            <InputField label="Nationality" field="nationality" placeholder="e.g. Ghanaian" />
            <InputField label="Phone" field="phone" placeholder="+233..." />
            <SelectField label="Status" field="status" options={['Active', 'Inactive', 'Injured', 'Trial']} />
          </div>
        </div>

        {/* Football Info */}
        <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">⚽ Football Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectField label="Age Group" field="ageGroup" options={['U-8', 'U-10', 'U-12', 'U-14', 'U-15', 'U-17']} required />
            <SelectField label="Position" field="position" options={['Goalkeeper', 'Defender', 'Midfielder', 'Forward']} required />
            <SelectField label="Preferred Foot" field="preferredFoot" options={['Right', 'Left', 'Both']} />
            <InputField label="Jersey Number" field="jerseyNumber" type="number" />
            <InputField label="Date Joined" field="dateJoined" type="date" />
          </div>
        </div>

        {/* Parent/Guardian */}
        <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">👨‍👩‍👦 Parent / Guardian</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField label="Parent Name" field="parentName" required placeholder="Full name" />
            <InputField label="Phone" field="parentPhone" required placeholder="+233..." />
            <InputField label="Email" field="parentEmail" type="email" placeholder="email@example.com" />
            <SelectField label="Relationship" field="parentRelation" options={['Father', 'Mother', 'Guardian', 'Uncle', 'Aunt']} />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">🚨 Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField label="Contact Name" field="emergencyName" required />
            <InputField label="Phone" field="emergencyPhone" required placeholder="+233..." />
            <SelectField label="Relationship" field="emergencyRelation" options={['Father', 'Mother', 'Guardian', 'Sibling', 'Other']} />
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">📚 Education</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField label="School" field="school" placeholder="School name" />
            <InputField label="Class" field="className" placeholder="e.g. JHS 2" />
            <SelectField label="Academic Performance" field="academicPerformance" options={['Excellent', 'Very Good', 'Good', 'Average', 'Below Average']} />
          </div>
        </div>

        {/* Medical */}
        <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">🏥 Medical Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectField label="Blood Group" field="bloodGroup" options={['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']} />
            <InputField label="Allergies" field="allergies" placeholder="None or list allergies" />
            <InputField label="Medical Conditions" field="medicalConditions" placeholder="None or list conditions" />
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">📍 Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField label="House / Address" field="address" placeholder="House number, street" />
            <InputField label="City" field="city" placeholder="City" />
            <InputField label="Region" field="region" placeholder="Region" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/players')} className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button type="submit" className="px-6 py-2.5 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-2">
            <Save size={16} /> {isEdit ? 'Update Player' : 'Register Player'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};
