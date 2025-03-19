'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getUserInfo, updateProfile, checkUsername, deleteProfile ,logoutUser} from '@/lib/api';
import LoadingButton from '@/components/ui/loadingButton';

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  });

  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [isNameTaken, setIsNameTaken] = useState<boolean | null>(null);
  const [resMessage, setResMessage] = useState("");
  const router = useRouter();
  const [hasChangedUsername, setHasChangedUsername] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; currentPassword?: string; newPassword?: string }>({});

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handleToggle = () => setNotificationStatus(!notificationStatus);

  useEffect(() => {
    if (!username || username === user?.username) {
      setIsNameTaken(null);
      setResMessage("");
      setHasChangedUsername(false);
      setErrors(prev => ({ ...prev, username: "" }));
      return;
    }

    const delayCheck = setTimeout(async () => {
      try {
        const response = await checkUsername(username);
        setIsNameTaken(response.data);
        console.log(response.data);
        setResMessage(response.message);
        setErrors(prev => ({ ...prev, username: response.data ? response.message : "" }));
      } catch {
        setErrors(prev => ({ ...prev, username: "Error checking username" }));
      }
    }, 500);

    return () => clearTimeout(delayCheck);
  }, [username]);


  useEffect(() => {
    const fetchhh = async () => {
      const response = await checkUsername(username);
      console.log(response,"waa")
    }
    fetchhh()
  },[])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setHasChangedUsername(true);
  };


  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      alert('Profile updated successfully');
      setErrors({});
    },
    onError: () => {
      setErrors(prev => ({ ...prev, currentPassword: "Incorrect current password" }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn : (userId: string) => deleteProfile(userId),
    onSuccess: () => {
      alert('Profile deleted successfully');
    },
  });

  const handleSaveChanges = () => {
    const validationErrors: { username?: string; currentPassword?: string; newPassword?: string } = {};
    if (!currentPassword) validationErrors.currentPassword = "Current password is required";
    if (hasChangedUsername && !username.trim()) validationErrors.username = "Username cannot be empty";
    if (newPassword && newPassword.length < 6) validationErrors.newPassword = "Password must be at least 8 characters";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    updateMutation.mutate({ username, currentPassword, newPassword });
  };

  const handleDeleteProfile = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      console.log(user)
      if(user){
        deleteMutation.mutate(user?._id);
        logoutUser()
        router.push('/');
      } 
           
    }
  };

  const isSubmitDisabled = (!hasChangedUsername && !newPassword) || !currentPassword;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading profile</div>;

  return (
    <div className='w-1/2'>
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Personal Informations</h3>
        <label className="block font-normal text-gray-600">Username</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded mt-1" 
          value={username} 
          onChange={handleUsernameChange}
        />
        {hasChangedUsername && isNameTaken !== null && (
          <p className={`text-sm ${isNameTaken ? "text-red-600" : "text-green-600"}`}>
            {isNameTaken ? `❌ ${resMessage}` : `✅ ${resMessage}`}
          </p>
        )}

        <label className="block text-gray-600 font-normal mt-3">Email</label>
        <input type="email" className="w-full p-2 border rounded text-gray-500" value={user?.email} readOnly />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Change Your Password</h3>
        <label className="block text-gray-600 font-normal">Current Password</label>
        <input 
          type="password" 
          className="w-full p-2 border rounded mt-1"
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        
        {errors.currentPassword && <p className="text-sm text-red-600">{errors.currentPassword}</p>}

        <label className="block text-gray-600 font-normal mt-3">New Password</label>
        <input 
          type="password" 
          className="w-full p-2 border rounded mt-1" 
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {errors.newPassword && <p className="text-sm text-red-600">{errors.newPassword}</p>}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <span className="text-gray-600 font-normal">Allow Notifications</span>
        <button
            onClick={handleToggle}
            className={`relative w-12 h-6 rounded-full border border-gray-300 ${
              notificationStatus ? "bg-white" : "bg-gray-500"
            }`}
>
          <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${notificationStatus ? 'translate-x-6 bg-gray-500' : 'translate-x-0  bg-white'}`} />
        </button>
      </div>
      
      <button 
        onClick={handleSaveChanges} 
        className={`mt-4 px-4 py-2 rounded-md ${isSubmitDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"}`} 
        disabled={isSubmitDisabled}
      >
        Save Changes
      </button>
      
      <div className="mt-8 p-2 border-t">
        <h3 className="text-lg font-medium mt-2">Delete Profile</h3>
        <p className="text-gray-600 text-sm mb-3">
          Once you delete your profile, it will be deactivated immediately and all associated data will be permanently removed within approximately 30 days. This action is irreversible.
        </p>
        <LoadingButton
          onClick={handleDeleteProfile}
          isLoading={deleteMutation.isPending}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Delete Profile
        </LoadingButton>

      </div>
    </div>
  );
}
