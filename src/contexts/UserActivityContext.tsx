
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { toast } from "sonner";

interface UserActivity {
  lastLogin: Date;
  activities: {
    timestamp: Date;
    action: string;
    details?: string;
  }[];
}

interface UserActivityContextType {
  activity: UserActivity | null;
  isLoading: boolean;
  recordActivity: (action: string, details?: string) => void;
}

const UserActivityContext = createContext<UserActivityContextType | undefined>(undefined);

export function UserActivityProvider({ children }: { children: ReactNode }) {
  const [activity, setActivity] = useState<UserActivity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize activity on mount
  useEffect(() => {
    setActivity({
      lastLogin: new Date(),
      activities: []
    });
  }, []);

  const recordActivity = (action: string, details?: string) => {
    setActivity(prevActivity => {
      if (!prevActivity) return {
        lastLogin: new Date(),
        activities: [{
          timestamp: new Date(),
          action,
          details
        }]
      };

      return {
        ...prevActivity,
        activities: [
          {
            timestamp: new Date(),
            action,
            details
          },
          ...prevActivity.activities.slice(0, 99) // Keep only the last 100 activities
        ]
      };
    });
  };

  return (
    <UserActivityContext.Provider
      value={{
        activity,
        isLoading,
        recordActivity
      }}
    >
      {children}
    </UserActivityContext.Provider>
  );
}

export function useUserActivity() {
  const context = useContext(UserActivityContext);
  if (context === undefined) {
    throw new Error("useUserActivity must be used within a UserActivityProvider");
  }
  return context;
}
