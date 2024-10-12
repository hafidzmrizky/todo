import Header from "@/components/Header";
import useFetch from "@/hooks/useFetch";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

const Profile: React.FC = () => {
    const [sessionToken] = useLocalStorage('session_token', '');
    const [name, setName] = useState('');
    const headers = useMemo(() => ({
        'session-id': sessionToken,
      }), [sessionToken]);

    const { data, loading, error } = useFetch('/api/account/', headers);

    useEffect(() => {
        if (error) {
          console.error(error);
          console.error('Session check failed, generating new session');
        }

    
        if (data) {
            setName(data.name);
        }
    }, [error, loading, data]);

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = async () => {

        if (isEditing) {
            const attemptChangePing = await fetch('/api/account/modify-name', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'session-id': sessionToken,
                },
                body: JSON.stringify({ name: name }),
            });

            if (attemptChangePing.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Name changed successfully',
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to change name',
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true,
                });
            }
        }

        setIsEditing(!isEditing);
    };

    const handleExportSession = async () => {
        
        const getQRCode = await fetch('/api/qr/login/' + sessionToken);

        if (getQRCode.status !== 200) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to generate QR code',
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
            });
            return;
        }

        const popupContainer = document.createElement('div');
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupContainer.style.width = '300px';
        popupContainer.style.height = '400px';
        popupContainer.style.backgroundColor = 'white';
        popupContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        popupContainer.style.zIndex = '1000';
        popupContainer.style.padding = '20px';
        popupContainer.style.textAlign = 'center';

        const qrCodeImage = document.createElement('img');
        qrCodeImage.src = URL.createObjectURL(await getQRCode.blob());
        qrCodeImage.alt = 'QR Code Placeholder';
        qrCodeImage.style.width = '100%';
        qrCodeImage.style.height = 'auto';

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.marginTop = '20px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#4A90E2';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';

        closeButton.onclick = () => {
            document.body.removeChild(popupContainer);
        };
        const authIdText = document.createElement('p');
        authIdText.innerText = 'Authentication ID: Do not share because people can act on your behalf';
        authIdText.className = 'text-poppins text-sm text-gray-500';
        popupContainer.appendChild(authIdText);
        popupContainer.appendChild(closeButton);
        popupContainer.appendChild(qrCodeImage);
        document.body.appendChild(popupContainer);
    };

    const handleNameChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setName(e.target.value);
    };

    return (
        <>
        {loading && <div>Loading...</div>}

        {!loading && (
            <div className='dark:bg-[#121212] dark:text-white bg-white text-black'>
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white font-poppins">Session Profile</h3>
            </div>
            <div className="border-t border-gray-200">
                <dl>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 flex items-center">
                    Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-3 flex items-center">
                    {isEditing ? (
                        <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                        />
                    ) : (
                        <span className="flex-grow">{name}</span>
                    )}
                    <button
                        onClick={toggleEdit}
                        className="ml-2 p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 focus:outline-none"
                    >
                        <Icon 
                        icon={isEditing ? 'ic:baseline-done' : 'ic:baseline-edit'} 
                        width="24" 
                        height="24" 
                        className="text-indigo-600 dark:text-indigo-400"
                        />
                    </button>
                    </dd>
                </div>
                </dl>
            </div>
            <div className="px-4 py-5 sm:px-6">
                <div className="flex flex-col space-y-3">
                <button
                    onClick={handleExportSession}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Export Session
                </button>
                </div>
            </div>
            </div>
        </div>
        )}
        
        </>
    )


    



}

export default Profile;