import { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Mock data
const examsData = [
  {
    id: 1,
    title: 'Ujian Bahasa Indonesia - Kelas 5A',
    subject: 'Bahasa Indonesia',
    class: '5A',
    date: '2024-01-20',
    totalParticipants: 32,
    completedParticipants: 28,
    status: 'Berlangsung'
  },
  {
    id: 2,
    title: 'Ujian IPA - Kelas 4B',
    subject: 'IPA',
    class: '4B',
    date: '2024-01-22',
    totalParticipants: 30,
    completedParticipants: 30,
    status: 'Selesai'
  },
  {
    id: 3,
    title: 'Ujian Matematika - Kelas 6A',
    subject: 'Matematika',
    class: '6A',
    date: '2024-01-25',
    totalParticipants: 35,
    completedParticipants: 0,
    status: 'Belum Dimulai'
  }
];

const subjects = ['Semua Mata Pelajaran', 'Bahasa Indonesia', 'Matematika', 'IPA', 'IPS'];
const classes = ['Semua Kelas', '4A', '4B', '5A', '5B', '6A', '6B'];

export default function Exams() {
  const [exams, setExams] = useState(examsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Semua Mata Pelajaran');
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    date: '',
    totalParticipants: ''
  });

  // Filter exams
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'Semua Mata Pelajaran' || exam.subject === selectedSubject;
    const matchesClass = selectedClass === 'Semua Kelas' || exam.class === selectedClass;
    return matchesSearch && matchesSubject && matchesClass;
  });

  const handleAddExam = () => {
    const newExam = {
      id: exams.length + 1,
      ...formData,
      totalParticipants: parseInt(formData.totalParticipants),
      completedParticipants: 0,
      status: 'Belum Dimulai'
    };
    setExams([...exams, newExam]);
    setFormData({ title: '', subject: '', class: '', date: '', totalParticipants: '' });
    setIsAddModalOpen(false);
    toast({
      title: "Berhasil!",
      description: "Ujian baru berhasil dibuat.",
    });
  };

  const handleEditExam = () => {
    setExams(exams.map(exam => 
      exam.id === selectedExam.id 
        ? { ...exam, ...formData, totalParticipants: parseInt(formData.totalParticipants) }
        : exam
    ));
    setIsEditModalOpen(false);
    toast({
      title: "Berhasil!",
      description: "Data ujian berhasil diperbarui.",
    });
  };

  const handleDeleteExam = () => {
    setExams(exams.filter(exam => exam.id !== selectedExam.id));
    setIsDeleteModalOpen(false);
    toast({
      title: "Berhasil!",
      description: "Ujian berhasil dihapus.",
    });
  };

  const openEditModal = (exam: any) => {
    setSelectedExam(exam);
    setFormData({
      title: exam.title,
      subject: exam.subject,
      class: exam.class,
      date: exam.date,
      totalParticipants: exam.totalParticipants.toString()
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (exam: any) => {
    setSelectedExam(exam);
    setIsDeleteModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'bg-success text-success-foreground';
      case 'Berlangsung': return 'bg-warning text-warning-foreground';
      case 'Belum Dimulai': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCompletionPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Ujian</h1>
          <p className="text-muted-foreground">Kelola ujian essay dan penilaiannya</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              Buat Ujian Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Buat Ujian Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Ujian</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Masukkan judul ujian"
                />
              </div>
              <div>
                <Label htmlFor="subject">Mata Pelajaran</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mata pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
                    <SelectItem value="Matematika">Matematika</SelectItem>
                    <SelectItem value="IPA">IPA</SelectItem>
                    <SelectItem value="IPS">IPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="class">Kelas</Label>
                <Select value={formData.class} onValueChange={(value) => setFormData({...formData, class: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4A">4A</SelectItem>
                    <SelectItem value="4B">4B</SelectItem>
                    <SelectItem value="5A">5A</SelectItem>
                    <SelectItem value="5B">5B</SelectItem>
                    <SelectItem value="6A">6A</SelectItem>
                    <SelectItem value="6B">6B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Tanggal Ujian</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="totalParticipants">Jumlah Peserta</Label>
                <Input
                  id="totalParticipants"
                  type="number"
                  value={formData.totalParticipants}
                  onChange={(e) => setFormData({...formData, totalParticipants: e.target.value})}
                  placeholder="Masukkan jumlah peserta"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddExam} className="flex-1 bg-gradient-primary hover:opacity-90">
                  Buat Ujian
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
            placeholder="Cari ujian berdasarkan judul..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <Card key={exam.id} className="bg-gradient-card shadow-soft hover:shadow-hover transition-all duration-300 border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{exam.title}</h3>
                  <Badge className={getStatusColor(exam.status)}>
                    {exam.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mata Pelajaran:</span>
                  <span className="font-medium">{exam.subject}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Kelas:</span>
                  <Badge variant="outline">{exam.class}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tanggal:</span>
                  <span className="font-medium">{new Date(exam.date).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Progress:</span>
                  <span className="font-medium">
                    {exam.completedParticipants}/{exam.totalParticipants} 
                    ({getCompletionPercentage(exam.completedParticipants, exam.totalParticipants)}%)
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/exams/${exam.id}`)}
                  className="px-3"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(exam)}
                  className="px-3"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteModal(exam)}
                  className="px-3 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Data Ujian</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Judul Ujian</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-subject">Mata Pelajaran</Label>
              <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
                  <SelectItem value="Matematika">Matematika</SelectItem>
                  <SelectItem value="IPA">IPA</SelectItem>
                  <SelectItem value="IPS">IPS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-class">Kelas</Label>
              <Select value={formData.class} onValueChange={(value) => setFormData({...formData, class: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4A">4A</SelectItem>
                  <SelectItem value="4B">4B</SelectItem>
                  <SelectItem value="5A">5A</SelectItem>
                  <SelectItem value="5B">5B</SelectItem>
                  <SelectItem value="6A">6A</SelectItem>
                  <SelectItem value="6B">6B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-date">Tanggal Ujian</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-totalParticipants">Jumlah Peserta</Label>
              <Input
                id="edit-totalParticipants"
                type="number"
                value={formData.totalParticipants}
                onChange={(e) => setFormData({...formData, totalParticipants: e.target.value})}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleEditExam} className="flex-1 bg-gradient-primary hover:opacity-90">
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
            <DialogTitle>Hapus Ujian</DialogTitle>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Apakah Anda yakin ingin menghapus ujian berikut?
              </p>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-medium">{selectedExam.title}</p>
                <p className="text-sm text-muted-foreground">{selectedExam.subject} - {selectedExam.class}</p>
                <p className="text-sm text-muted-foreground">Tanggal: {new Date(selectedExam.date).toLocaleDateString('id-ID')}</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleDeleteExam} variant="destructive" className="flex-1">
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