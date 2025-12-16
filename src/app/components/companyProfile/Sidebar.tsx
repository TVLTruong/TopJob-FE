'use client'

import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Building2, Users, Globe, LogOut, Settings, HelpCircle } from 'lucide-react'

export default function Sidebar() {
  return (
    <div style={{ backgroundColor: 'red', padding: '20px' }}>
      🔴 THIS IS SIDEBAR - IF YOU SEE THIS, IT MEANS SIDEBAR IS RENDERING
    </div>
  );
}
