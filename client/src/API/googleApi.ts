import axios, { ResponseType } from 'axios'
import { CallbackDoc } from 'react-google-drive-picker/dist/typeDefs'
import { Script } from 'src/components/ReaderV3/reader.types'
import { BASE_URI } from 'src/config'

interface getFileGoogleDriveProps {
  docs: CallbackDoc
  access_token: string
  responseType?: ResponseType
}

export const getGoogleDriveFileById = async ({
  docs,
  access_token,
  responseType = 'arraybuffer',
}: getFileGoogleDriveProps) => {
  const { data } = await axios.get(
    `https://www.googleapis.com/drive/v3/files/${docs.id}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
      responseType: responseType,
      params: {
        alt: 'media',
      },
    }
  )

  return data
}

export type arrayBufferResponse = {
  id: string
  data: ArrayBuffer
}

export const downloadFiles = async (
  access_token: string,
  sceneId: string
): Promise<arrayBufferResponse[]> => {
  const response = await axios.get(
    'https://www.googleapis.com/drive/v3/files',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      params: {
        q: `mimeType='application/vnd.google-apps.folder' and fullText contains '${sceneId}' and trashed=false`,
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
      },
    }
  )
  //Expect only one folder with the sceneId
  if (response.data.files.length !== 1) {
    throw new Error('Duplicate folder names!')
  }

  const folderId = response.data.files[0].id
  const docs: CallbackDoc[] = await downloadFolderWithMP3({
    access_token,
    folderId,
  })
  const files = await getGoogleDriveFilesByIds({ access_token, docs })

  return files
}

interface downloadFolderWithMP3Props {
  scriptId?: string
  folderId: string
  access_token: string
}

export const downloadFolderWithMP3 = async ({
  access_token,
  folderId,
}: downloadFolderWithMP3Props) => {
  const filesUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType='audio/mpeg'&access_token=${access_token}`
  const filesResponse = await fetch(filesUrl)
  const filesData = await filesResponse.json()
  const mp3Files = filesData.files

  return mp3Files
}

interface getGoogleDriveFilesByIdsProps {
  docs: CallbackDoc[]
  access_token: string
  responseType?: ResponseType
}

export const getGoogleDriveFilesByIds = async ({
  docs = [],
  access_token,
  responseType = 'arraybuffer',
}: getGoogleDriveFilesByIdsProps) => {
  const results = await Promise.all(
    docs.map((doc) =>
      axios.get(`https://www.googleapis.com/drive/v3/files/${doc.id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        },
        responseType: responseType,
        params: {
          alt: 'media',
        },
      })
    )
  )

  const dataArray = results.map((result, index) => ({
    id: docs[index].name.replace('.mp3', ''),
    data: result.data,
  }))

  return dataArray
}

export const createFolder = async (access_token: string) => {
  let createFolderOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mimeType: 'application/vnd.google-apps.folder',
      name: 'dramatify-pdf-reader',
    }),
  }
  const { data } = await axios.post(
    'https://www.googleapis.com/drive/v3/files',
    createFolderOptions
  )
  return data
}

export const createTextToSpeech = async (script: Script) => {
  const { data } = await axios.post(`${BASE_URI}/api/v3/text-to-speech`, {
    script,
  })
  return data
}
