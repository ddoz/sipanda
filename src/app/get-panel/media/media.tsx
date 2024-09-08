import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import FormUpload from './form-upload'
import MediaList from './media-list'
import { IMedia } from '@/interfaces/media-interface'
const MediaContentPage = ({select = false, data}:{select?:boolean, data:IMedia[]}) => {
  return (
    <Tabs defaultValue="upload">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="upload">
        <FormUpload />
      </TabsContent>
      <TabsContent value="media">
        <MediaList select={select} data={data} />
      </TabsContent>
    </Tabs>
  )
}

export default MediaContentPage