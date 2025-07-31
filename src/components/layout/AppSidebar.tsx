import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Users,
  FileText,
  User,
  LogOut,
  Home,
  Menu,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Data Siswa', url: '/students', icon: Users },
  { title: 'Data Ujian', url: '/exams', icon: FileText },
  { title: 'Profil Guru', url: '/profile', icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground";

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked');
  };

  return (
    <Sidebar className={cn(
      "border-r border-border bg-card transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <SidebarContent className="p-4">
        {/* Logo/Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-foreground">EssayBuddy</h2>
              <p className="text-xs text-muted-foreground">Sistem Penilaian Essay</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-xs uppercase tracking-wide text-muted-foreground mb-2",
            collapsed && "hidden"
          )}>
            Menu Utama
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink 
                    to={item.url} 
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 w-full",
                      getNavCls({ isActive })
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className="mt-auto pt-4">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            onClick={handleLogout}
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}