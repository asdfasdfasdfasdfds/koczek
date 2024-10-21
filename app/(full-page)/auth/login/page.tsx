/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { getSession, signIn, useSession } from 'next-auth/react';
import { FieldValues, useForm } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUser } from '@/redux/slices/authSlice';

const LoginPage = () => {
 
  
    
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { data, status } = useSession();
 
    useEffect(() => {
       if (data && status === "authenticated") {
          dispatch(setUser(data.user));
       }
    }, [data, dispatch, status])
    const [isLoading, setIsLoading] = useState(false); // Initialize isLoading with false
    const toast = useRef<Toast>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: "onTouched",
    });
    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    async function submitForm(data: FieldValues) {
        try {
            setIsLoading(true); // Set isLoading to true when starting the form submission

            const res = await signIn("credentials", { username: data.username, password: data.password, redirect: false });
            if (res?.error != null) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: res?.error,
                    life: 3000
                }
                );
            } else if (res?.ok == true) {
                const session = await getSession(); // Import getSession from 'next-auth/react'
                const user = session?.user;
                if (user) {
          dispatch(setUser(user)); // Dispatch the user to Redux store or handle it as needed

                  //  router.push("/");
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Başarılı',
                        detail: 'Giriş Yapıldı !',
                        life: 3000
                    });
                    
                    console.info("Logged in!");

                }
                else {
                    console.error("error");
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Hata',
                        detail: "Error",
                        life: 3000
                    });
                }
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";
            toast.current?.show({
                severity: 'error',
                summary: 'Hata',
                detail: errorMessage,
                life: 3000
            });
          }
          
        finally {
            setIsLoading(false); // Reset isLoading to false after form submission (whether successful or not)
        }
    }

    return (
        <div className={containerClassName}>
                    <Toast ref={toast} />

            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-dark.png`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Hoşgeldin !</div>
                            <span className="text-600 font-medium">Giriş yapmak için devam et</span>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit(submitForm)}>

                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Kullanıcı Adı
                            </label>
                            <InputText id="email1" type="text" placeholder="E-Posta Adresi" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }}

                                {...register('username', { required: 'Geçerli bir e-posta adresi girmelisiniz' })}
                            />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Şifre
                            </label>
                            <InputText type='password' placeholder="Şifre" className="w-full mb-5"
                                {...register('password', { required: 'Geçerli bir şifre girmelisiniz' })}

                            ></InputText>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Beni hatırla</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                   Şifreni mi unuttun ?
                                </a>
                            </div>
                            <Button label={isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"} className="w-full p-3 text-xl" type="submit" disabled={isLoading}></Button>
                            </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
