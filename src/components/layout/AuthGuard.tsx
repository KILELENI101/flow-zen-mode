import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2, Timer } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="p-4 bg-gradient-primary rounded-full">
              <Timer className="h-12 w-12 text-primary-foreground animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading FocusFlow...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;