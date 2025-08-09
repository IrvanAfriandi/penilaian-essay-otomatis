import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Trash2, BookOpen, Clock } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Mock data
const mockSubjects = [
  { 
    id: 1, 
    name: 'Matematika', 
    code: 'MTK', 
    description: 'Mata pelajaran matematika untuk kelas X-XII',
    teacher: 'Pak Andi',
    totalExams: 5
  },
  { 
    id: 2, 
    name: 'Bahasa Indonesia', 
    code: 'BIN', 
    description: 'Mata pelajaran bahasa Indonesia untuk kelas X-XII',
    teacher: 'Ibu Sari',
    totalExams: 3
  },
  { 
    id: 3, 
    name: 'Fisika', 
    code: 'FIS', 
    description: 'Mata pelajaran fisika untuk kelas X-XII IPA',
    teacher: 'Pak Budi',
    totalExams: 4
  },
  { 
    id: 4, 
    name: 'Kimia', 
    code: 'KIM', 
    description: 'Mata pelajaran kimia untuk kelas X-XII IPA',
    teacher: 'Ibu Maya',
    totalExams: 2
  },
  { 
    id: 5, 
    name: 'Sejarah', 
    code: 'SEJ', 
    description: 'Mata pelajaran sejarah untuk kelas X-XII IPS',
    teacher: 'Pak Dedi',
    totalExams: 3
  },
];

export default function Subjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjects, setSubjects] = useState(mockSubjects);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [newSubject, setNewSubject] = useState({ 
    name: '', 
    code: '', 
    description: '', 
    teacher: '' 
  });

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.code && newSubject.teacher) {
      const newId = Math.max(...subjects.map(s => s.id)) + 1;
      setSubjects([...subjects, { 
        id: newId, 
        ...newSubject, 
        totalExams: 0 
      }]);
      setNewSubject({ name: '', code: '', description: '', teacher: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditSubject = () => {
    if (editingSubject && editingSubject.name && editingSubject.code && editingSubject.teacher) {
      setSubjects(subjects.map(s => 
        s.id === editingSubject.id ? editingSubject : s
      ));
      setEditingSubject(null);
    }
  };

  const handleDeleteSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Mata Pelajaran</h1>
          <p className="text-muted-foreground">Kelola data mata pelajaran sekolah</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Mata Pelajaran
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Mata Pelajaran Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subjectName">Nama Mata Pelajaran</Label>
                <Input
                  id="subjectName"
                  placeholder="Masukkan nama mata pelajaran"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subjectCode">Kode Mata Pelajaran</Label>
                <Input
                  id="subjectCode"
                  placeholder="Masukkan kode (misal: MTK)"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subjectTeacher">Guru Pengampu</Label>
                <Input
                  id="subjectTeacher"
                  placeholder="Masukkan nama guru"
                  value={newSubject.teacher}
                  onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subjectDescription">Deskripsi</Label>
                <Textarea
                  id="subjectDescription"
                  placeholder="Masukkan deskripsi mata pelajaran"
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddSubject} className="flex-1">Simpan</Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setNewSubject({ name: '', code: '', description: '', teacher: '' });
                    setIsAddDialogOpen(false);
                  }}
                  className="flex-1"
                >
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari mata pelajaran, kode, atau guru..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredSubjects.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Data mata pelajaran tidak ditemukan</p>
            <p className="text-sm">Coba ubah kata kunci pencarian Anda</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{subject.code}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Guru: {subject.teacher}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {subject.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {subject.totalExams} ujian
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Dialog open={editingSubject?.id === subject.id} onOpenChange={(open) => !open && setEditingSubject(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setEditingSubject(subject)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Mata Pelajaran</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="editSubjectName">Nama Mata Pelajaran</Label>
                          <Input
                            id="editSubjectName"
                            value={editingSubject?.name || ''}
                            onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editSubjectCode">Kode Mata Pelajaran</Label>
                          <Input
                            id="editSubjectCode"
                            value={editingSubject?.code || ''}
                            onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editSubjectTeacher">Guru Pengampu</Label>
                          <Input
                            id="editSubjectTeacher"
                            value={editingSubject?.teacher || ''}
                            onChange={(e) => setEditingSubject({ ...editingSubject, teacher: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editSubjectDescription">Deskripsi</Label>
                          <Textarea
                            id="editSubjectDescription"
                            value={editingSubject?.description || ''}
                            onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleEditSubject} className="flex-1">Simpan</Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingSubject(null)}
                            className="flex-1"
                          >
                            Batal
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Mata Pelajaran</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus mata pelajaran "{subject.name}"? 
                          Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteSubject(subject.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}