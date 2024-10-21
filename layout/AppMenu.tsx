/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import { useAppSelector } from '@/redux/hooks';
import { signOut } from 'next-auth/react';

const AppMenu = () => {

    const model: AppMenuItem[] = [
        {
            label: 'Ana Sayfa',
            items: [{ label: 'Ana Sayfa', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Diğer Sayfalar',
            items: [
                { label: 'Öğrenci Listesi', icon: 'pi pi-fw pi-users', to: '/students' },
                { label: 'Deneme Listesi', icon: 'pi pi-fw pi-table', to: '/examlist' },
                { label: 'Ödevler', icon: 'pi pi-fw pi-book', to: '/homeworks' },
                { label: 'Karşılaştırmalar', icon: 'pi pi-fw pi-chart-pie', to: '/compare' },
                { label: 'Deneme Sonuç Ekleme', icon: 'pi pi-fw pi-file', to: '/exam-result-add' },
                { label: 'Admin Kontrol', icon: 'pi pi-fw pi-pencil', to: '/admin-control' },
                { label: 'Çıkış Yap', icon: 'pi pi-fw pi-sign-out',  command: () => {signOut()} },
               
               
            ]
        }
    ];
    const  logOut: AppMenuItem =  {
        label: 'Çıkış Yap',
        //bu sayfa sadece adminlerde yani bizde olacak öğrencileri tek tek bir sınıfa ekleyeceğiz.
        icon: 'pi pi-fw pi-sign-out',
        command: () => {signOut()}
        
    };
    return (
        <MenuProvider>

            <ul className="layout-menu z-9999 ">

                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
                 <li className="menu-separator"></li>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
