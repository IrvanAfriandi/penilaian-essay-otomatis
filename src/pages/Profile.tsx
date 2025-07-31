import { useState } from 'react';
import { Camera, Save, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    photo: null,
    name: 'Guru Terbaik',
    email: 'guru.terbaik@sekolah.com',
    phone: '081234567890',
    gender: 'Perempuan',
    address: 'Jl. Pendidikan No. 123, Jakarta',
    school: 'SDN Cerdas Bangsa',
    subject: 'Bahasa Indonesia',
    experience: '5',
    education: 'S1 Pendidikan Bahasa Indonesia'
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    toast({
      title: "Berhasil!",
      description: "Profil berhasil diperbarui.",
    });
  };

  const handlePhotoUpload = () => {
    toast({
      title: "Upload Foto",
      description: "Fitur upload foto akan segera tersedia.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profil Guru</h1>
        <p className="text-muted-foreground">Kelola informasi profil dan data pribadi Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo Section */}
        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader>
            <CardTitle className="text-center">Foto Profil</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="relative mx-auto w-32 h-32">
              <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center text-white text-4xl font-bold shadow-soft">
                {profileData.name.charAt(0)}
              </div>
              <Button
                onClick={handlePhotoUpload}
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-secondary hover:bg-secondary/90"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{profileData.name}</h3>
              <p className="text-muted-foreground">{profileData.subject}</p>
              <p className="text-sm text-muted-foreground">{profileData.school}</p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-card shadow-soft border-0">
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Masukkan email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">No. Handphone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Masukkan nomor handphone"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="bg-card shadow-soft border-0">
            <CardHeader>
              <CardTitle>Informasi Profesional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="school">Nama Sekolah</Label>
                  <Input
                    id="school"
                    value={profileData.school}
                    onChange={(e) => handleInputChange('school', e.target.value)}
                    placeholder="Masukkan nama sekolah"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Mata Pelajaran</Label>
                  <Select value={profileData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
                      <SelectItem value="Matematika">Matematika</SelectItem>
                      <SelectItem value="IPA">IPA</SelectItem>
                      <SelectItem value="IPS">IPS</SelectItem>
                      <SelectItem value="PKN">PKN</SelectItem>
                      <SelectItem value="Seni Budaya">Seni Budaya</SelectItem>
                      <SelectItem value="Olahraga">Olahraga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Pengalaman Mengajar (Tahun)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={profileData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Masukkan pengalaman mengajar"
                  />
                </div>
                <div>
                  <Label htmlFor="education">Pendidikan Terakhir</Label>
                  <Input
                    id="education"
                    value={profileData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    placeholder="Masukkan pendidikan terakhir"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="bg-card shadow-soft border-0">
            <CardHeader>
              <CardTitle>Statistik Mengajar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">245</div>
                  <div className="text-sm text-muted-foreground">Total Siswa</div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">18</div>
                  <div className="text-sm text-muted-foreground">Ujian Dibuat</div>
                </div>
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">85.2</div>
                  <div className="text-sm text-muted-foreground">Nilai Rata-rata</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} className="bg-gradient-primary hover:opacity-90 px-8">
              <Save className="mr-2 h-4 w-4" />
              Simpan Profil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}