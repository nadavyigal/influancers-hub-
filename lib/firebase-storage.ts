import { storage } from "./firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll, getMetadata, updateMetadata } from "firebase/storage"

export interface UploadedFile {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  uploadDate: number
  downloadURL: string
  metadata: any
}

export const uploadFile = async (userId: string, file: File): Promise<void> => {
  const storageRef = ref(storage, `users/${userId}/${file.name}`)
  await uploadBytes(storageRef, file)
}

export const getUploadedFiles = async (userId: string): Promise<UploadedFile[]> => {
  const listRef = ref(storage, `users/${userId}`)
  const res = await listAll(listRef)
  const files: UploadedFile[] = []

  for (const itemRef of res.items) {
    const downloadURL = await getDownloadURL(itemRef)
    const metadata = await getMetadata(itemRef)
    files.push({
      id: itemRef.name,
      fileName: itemRef.name,
      fileSize: metadata.size,
      fileType: metadata.contentType || "unknown",
      uploadDate: metadata.timeCreated ? new Date(metadata.timeCreated).getTime() : Date.now(),
      downloadURL: downloadURL,
      metadata: metadata,
    })
  }

  return files
}

export const deleteUploadedFile = async (fileId: string, userId: string): Promise<void> => {
  const fileRef = ref(storage, `users/${userId}/${fileId}`)
  await deleteObject(fileRef)
}

export const updateFileMetadata = async (
  fileId: string,
  userId: string,
  metadata: Record<string, any>,
): Promise<void> => {
  const fileRef = ref(storage, `users/${userId}/${fileId}`)
  await updateMetadata(fileRef, metadata)
}

