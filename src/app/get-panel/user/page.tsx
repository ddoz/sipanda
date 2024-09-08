import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckSquare2Icon, PlusCircle } from 'lucide-react'
import React, { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactQuill from 'react-quill'
import Content from './content'
import { getUser } from '@/services/user'

const UserPage = async ({
    searchParams
  }: {
    searchParams: { page: string };
  }) => {
    const page = parseInt(searchParams.page) || 1;
    const limit = 20;
    const { berita, total } = await getUser(page, limit);

    const totalPages = Math.ceil(total / limit);

  return (
    <div className='w-full flex mt-2'>
        <Content 
            data={berita} 
            currentPage={page}
            totalPages={totalPages} 
        />
    </div>
  )
}

export default UserPage