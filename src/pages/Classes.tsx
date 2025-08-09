import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash2, Users } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Mock data
const mockClasses = [
  { id: 1, name: 'X IPA 1', totalStudents: 32, homeRoomTeacher: 'Ibu Sari' },
  { id: 2, name: 'X IPA 2', totalStudents: 30, homeRoomTeacher: 'Pak Budi' },
  { id: 3, name: 'X IPS 1', totalStudents: 28, homeRoomTeacher: 'Ibu Ani' },
  { id: 4, name: 'XI IPA 1', totalStudents: 31, homeRoomTeacher: 'Pak Dedi' },
  { id: 5, name: 'XI IPA 2', totalStudents: 29, homeRoomTeacher: 'Ibu Maya' },
  { id: 6, name: 'XII IPA 1', totalStudents: 33, homeRoomTeacher: 'Pak Rudi' },
];

export default function Classes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState(mockClasses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [newClass, setNewClass] = useState({ name: '', homeRoomTeacher: '' });

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.homeRoomTeacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClass = () => {
    if (newClass.name && newClass.homeRoomTeacher) {
      const newId = Math.max(...classes.map(c => c.id)) + 1;
      setClasses([...classes, { 
        id: newId, 
        ...newClass, 
        totalStudents: 0 
      }]);
      setNewClass({ name: '', homeRoomTeacher: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditClass = () => {
    if (editingClass && editingClass.name && editingClass.homeRoomTeacher) {
      setClasses(classes.map(c => 
        c.id === editingClass.id ? editingClass : c
      ));
      setEditingClass(null);
    }
  };

  const handleDeleteClass = (id: number) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Kelas</h1>
          <p className="text-muted-foreground">Kelola data kelas sekolah</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Kelas
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kelas Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="className">Nama Kelas</Label>
                <Input
                  id="className"
                  placeholder="Masukkan nama kelas"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="homeRoomTeacher">Wali Kelas</Label>
                <Input
                  id="homeRoomTeacher"
                  placeholder="Masukkan nama wali kelas"
                  value={newClass.homeRoomTeacher}
                  onChange={(e) => setNewClass({ ...newClass, homeRoomTeacher: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddClass} className="flex-1">Simpan</Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setNewClass({ name: '', homeRoomTeacher: '' });
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
            placeholder="Cari kelas atau wali kelas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredClasses.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Data kelas tidak ditemukan</p>
            <p className="text-sm">Coba ubah kata kunci pencarian Anda</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((cls) => (
            <Card key={cls.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{cls.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Wali Kelas: {cls.homeRoomTeacher}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {cls.totalStudents} siswa
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Dialog open={editingClass?.id === cls.id} onOpenChange={(open) => !open && setEditingClass(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setEditingClass(cls)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Kelas</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="editClassName">Nama Kelas</Label>
                          <Input
                            id="editClassName"
                            value={editingClass?.name || ''}
                            onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editHomeRoomTeacher">Wali Kelas</Label>
                          <Input
                            id="editHomeRoomTeacher"
                            value={editingClass?.homeRoomTeacher || ''}
                            onChange={(e) => setEditingClass({ ...editingClass, homeRoomTeacher: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleEditClass} className="flex-1">Simpan</Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingClass(null)}
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
                        <AlertDialogTitle>Hapus Kelas</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus kelas "{cls.name}"? 
                          Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteClass(cls.id)}
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