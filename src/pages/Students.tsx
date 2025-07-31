import { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Mock data
const studentsData = [
  {
    id: 1,
    name: 'Ahmad Rizki',
    class: '5A',
    nisn: '1234567890',
    gender: 'Laki-laki',
    photo: null,
    totalExams: 5,
    averageScore: 85.5
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    class: '5A',
    nisn: '1234567891',
    gender: 'Perempuan',
    photo: null,
    totalExams: 5,
    averageScore: 92.3
  },
  {
    id: 3,
    name: 'Budi Santoso',
    class: '5B',
    nisn: '1234567892',
    gender: 'Laki-laki',
    photo: null,
    totalExams: 4,
    averageScore: 78.8
  },
  {
    id: 4,
    name: 'Dewi Sartika',
    class: '5B',
    nisn: '1234567893',
    gender: 'Perempuan',
    photo: null,
    totalExams: 5,
    averageScore: 88.7
  },
  {
    id: 5,
    name: 'Muhammad Faris',
    class: '6A',
    nisn: '1234567894',
    gender: 'Laki-laki',
    photo: null,
    totalExams: 6,
    averageScore: 91.2
  },
  {
    id: 6,
    name: 'Aisyah Putri',
    class: '6A',
    nisn: '1234567895',
    gender: 'Perempuan',
    photo: null,
    totalExams: 6,
    averageScore: 94.5
  }
];

const classes = ['Semua Kelas', '5A', '5B', '6A', '6B'];

export default function Students() {
  const [students, setStudents] = useState(studentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    class: '',
    nisn: '',
    gender: ''
  });

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.nisn.includes(searchTerm);
    const matchesClass = selectedClass === 'Semua Kelas' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleAddStudent = () => {
    const newStudent = {
      id: students.length + 1,
      ...formData,
      photo: null,
      totalExams: 0,
      averageScore: 0
    };
    setStudents([...students, newStudent]);
    setFormData({ name: '', class: '', nisn: '', gender: '' });
    setIsAddModalOpen(false);
    toast({
      title: "Berhasil!",
      description: "Data siswa berhasil ditambahkan.",
    });
  };

  const handleEditStudent = () => {
    setStudents(students.map(student => 
      student.id === selectedStudent.id 
        ? { ...student, ...formData }
        : student
    ));
    setIsEditModalOpen(false);
    toast({
      title: "Berhasil!",
      description: "Data siswa berhasil diperbarui.",
    });
  };

  const handleDeleteStudent = () => {
    setStudents(students.filter(student => student.id !== selectedStudent.id));
    setIsDeleteModalOpen(false);
    toast({
      title: "Berhasil!",
      description: "Data siswa berhasil dihapus.",
    });
  };

  const openEditModal = (student: any) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      class: student.class,
      nisn: student.nisn,
      gender: student.gender
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (student: any) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const openDetailModal = (student: any) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-warning';
    return 'text-destructive';
  };

  const getGenderColor = (gender: string) => {
    return gender === 'Laki-laki' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Siswa</h1>
          <p className="text-muted-foreground">Kelola data siswa dan informasi akademik</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Siswa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Siswa Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <Label htmlFor="class">Kelas</Label>
                <Select value={formData.class} onValueChange={(value) => setFormData({...formData, class: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5A">5A</SelectItem>
                    <SelectItem value="5B">5B</SelectItem>
                    <SelectItem value="6A">6A</SelectItem>
                    <SelectItem value="6B">6B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nisn">NISN</Label>
                <Input
                  id="nisn"
                  value={formData.nisn}
                  onChange={(e) => setFormData({...formData, nisn: e.target.value})}
                  placeholder="Masukkan NISN"
                />
              </div>
              <div>
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddStudent} className="flex-1 bg-gradient-primary hover:opacity-90">
                  Simpan
                </Button>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari siswa berdasarkan nama atau NISN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {classes.map(cls => (
              <SelectItem key={cls} value={cls}>{cls}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="bg-gradient-card shadow-soft hover:shadow-hover transition-all duration-300 border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">NISN: {student.nisn}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Kelas:</span>
                  <Badge variant="outline">{student.class}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Jenis Kelamin:</span>
                  <Badge className={getGenderColor(student.gender)}>{student.gender}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Ujian:</span>
                  <span className="font-medium">{student.totalExams}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Nilai Rata-rata:</span>
                  <span className={`font-medium ${getScoreColor(student.averageScore)}`}>
                    {student.averageScore.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDetailModal(student)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Detail
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(student)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteModal(student)}
                  className="flex-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Siswa</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xl font-medium">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">NISN: {selectedStudent.nisn}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Kelas</Label>
                  <p className="font-medium">{selectedStudent.class}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Jenis Kelamin</Label>
                  <p className="font-medium">{selectedStudent.gender}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Total Ujian</Label>
                  <p className="font-medium">{selectedStudent.totalExams}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Nilai Rata-rata</Label>
                  <p className={`font-medium ${getScoreColor(selectedStudent.averageScore)}`}>
                    {selectedStudent.averageScore.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Data Siswa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-class">Kelas</Label>
              <Select value={formData.class} onValueChange={(value) => setFormData({...formData, class: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5A">5A</SelectItem>
                  <SelectItem value="5B">5B</SelectItem>
                  <SelectItem value="6A">6A</SelectItem>
                  <SelectItem value="6B">6B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-nisn">NISN</Label>
              <Input
                id="edit-nisn"
                value={formData.nisn}
                onChange={(e) => setFormData({...formData, nisn: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-gender">Jenis Kelamin</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleEditStudent} className="flex-1 bg-gradient-primary hover:opacity-90">
                Simpan
              </Button>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Data Siswa</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Apakah Anda yakin ingin menghapus data siswa berikut?
              </p>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-medium">{selectedStudent.name}</p>
                <p className="text-sm text-muted-foreground">NISN: {selectedStudent.nisn}</p>
                <p className="text-sm text-muted-foreground">Kelas: {selectedStudent.class}</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleDeleteStudent} variant="destructive" className="flex-1">
                  Hapus
                </Button>
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="flex-1">
                  Batal
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}