import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckSquare2Icon, PlusCircle } from 'lucide-react'
import React, { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactQuill from 'react-quill'
import Content from './content'
import { getUser } from '@/services/user'

const ProfilPage = async () => {

  return (
    <div className='flex w-full mt-2'>
        <Content />
    </div>
  )
}

export default ProfilPage