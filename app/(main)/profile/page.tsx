'use client';
import BackButton from '@/demo/components/BackButton';
import { ProfileService } from '@/demo/service/ProfileService';
import { User } from '@/models/user';
import { getAuthToken } from '@/utils/util';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';

const Profile = () => {
    const [dropdownValueBranch, setDropdownValueBranch] = useState<string>('');
    const [dropdownValuesBranch, setDropdownValuesBranch] = useState<any[]>([]);
    const [displayBasic, setDisplayBasic] = useState(false);
    const [user, setUser] = useState<any>({

    });
    const toast = useRef<Toast>(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [userUpdated, setUserUpdated] = useState<any>({
        name: '',
        surname: '',
        username: '',
        email: '',
        branch: ''
    });

    const handleSubmit = async () => {
        // Validate if the new password and confirm password match
        if (newPassword !== confirmNewPassword) {
            alert('Yeni şifre ve şifre onayı eşleşmiyor.');
            return;
        }

        try {
            const response = await fetch(`${process.env.API_URL}/teacher/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`,  // Assuming you have a function to get auth token
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmNewPassword,
                }),
            });

            // Handle success
            if (response.ok) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: "Şifre değiştirildi",
                    life: 3000,
                });

                setDisplayBasic(false); // Close dialog on success
                // Reset input values
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            } else {
                const errorData = await response.json();
                console.log(errorData);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: errorData,
                    life: 3000,
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Hata',
                detail: "Şifre değiştirme başarısız",
                life: 3000,
            });
        }
    };


    useEffect(() => {
        ProfileService.getProfile()
            .then((data) => {
                setUser(data);
                setDropdownValuesBranch(data.branchs);
                setDropdownValueBranch(data.branch);
            })
            .catch((error) => console.error("Failed to fetch profile:", error));
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserUpdated((prevState: any) => ({
            ...prevState,
            [name]: value,
        }));
        setUser((prevState: any) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = () => {
        const updatedUser = {
            ...userUpdated,
            branch: dropdownValueBranch,
        };

        ProfileService.updateProfile(updatedUser)
            .then((response) => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Profil güncellendi !',
                    life: 3000,
                });
            })
            .catch(async (error) => {
                let errorMessage = 'Failed to update profile';

                if (error.response) {
                    try {
                        const errorData = await error.response.json();
                        errorMessage = errorData.message || JSON.stringify(errorData) || errorMessage;
                    } catch (parseError) {
                        console.error('Error parsing response:', parseError);
                    }
                }

                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: errorMessage,
                    life: 3000,
                });

                console.error("Failed to update profile:", error);
            });
    };


    const basicDialogFooter = (
        <div className="grid">
            <div className="col-12 mb-2 lg:col-12 lg:mb-0">
                <div className="flex justify-center w-full px-8">
                    <Button
                        type="button"
                        label="Şifreni değiştir"
                        onClick={handleSubmit}
                        icon="pi pi-check"
                        className="w-full"
                        severity="success"
                    />
                </div>
            </div>
        </div>
    );


    return (
        <div className="grid">
            <BackButton />
            <div className="card w-full">
                <Toast ref={toast} />
                <h5>Ayarlar</h5>
                <div className="grid">
                    <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                        <InputText
                            type="text"
                            className="w-full"
                            placeholder="Ad"
                            name="name"
                            value={user.name || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                        <InputText
                            type="text"
                            className="w-full"
                            placeholder="Soyad"
                            name="surname"
                            value={user.surname || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="grid">
                    <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                        <InputText
                            type="text"
                            className="w-full"
                            placeholder="Kullanıcı Adı"
                            name="username"
                            value={user.username || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                        <div className="w-full">
                            <Dropdown
                                value={dropdownValueBranch}
                                onChange={(e) => setDropdownValueBranch(e.value)}
                                options={dropdownValuesBranch}
                                optionLabel="name"
                                optionValue="_id"
                                placeholder="Branş Seçiniz"
                                className="w-full"
                            />
                        </div>
                    </div>


                </div>
                <div className="grid">
                    <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                        <InputText
                            type="text"
                            className="w-full"
                            placeholder="Telefon Numarası"
                            name="phone"
                            value={user.phone || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                        <InputText
                            type="text"
                            className="w-full"
                            placeholder="EPosta"
                            name="email"
                            value={user.email || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                </div>

                <div className="grid mt-2">
                    <div className="col-12">
                        <div className="flex flex-wrap gap-2 justify-content-end">
                            <Button label="Kaydet" onClick={handleSave} severity="success" />
                            <Button label="Şifre Değiştir" onClick={() => setDisplayBasic(true)} severity="info" />
                        </div>
                    </div>
                </div>
            </div>
            <Dialog header="Yeni Şifre" visible={displayBasic} style={{ width: '450px' }} modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>
                <div className="flex flex-column align-items-center justify-content-center text-center" style={{ height: '100%' }}>
                    <div className="col-12 mb-2">
                        <InputText
                            type="password"
                            placeholder="Mevcut Şifre"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="col-12 mb-2">
                        <InputText
                            type="password"
                            placeholder="Yeni Şifre"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="col-12 mb-2">
                        <InputText
                            type="password"
                            placeholder="Şifre Onay"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                </div>
            </Dialog>

        </div>
    );
};

export default Profile;
