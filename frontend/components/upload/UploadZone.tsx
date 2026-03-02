'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { Upload, X, File, Image, FileText, Film, Music } from 'lucide-react'

interface FileWithPreview extends File {
  preview?: string
  id?: string
}

interface UploadZoneProps {
  onUpload: (files: File[]) => void | Promise<void>
  accept?: Record<string, string[]>
  maxSize?: number
  maxFiles?: number
  multiple?: boolean
  className?: string
  disabled?: boolean
  showPreviews?: boolean
  value?: FileWithPreview[]
  onChange?: (files: FileWithPreview[]) => void
}

const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) return <Image className="w-8 h-8" />
  if (file.type.startsWith('video/')) return <Film className="w-8 h-8" />
  if (file.type.startsWith('audio/')) return <Music className="w-8 h-8" />
  if (file.type.startsWith('text/')) return <FileText className="w-8 h-8" />
  return <File className="w-8 h-8" />
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function UploadZone({
  onUpload,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  multiple = true,
  className,
  disabled = false,
  showPreviews = true,
  value = [],
  onChange,
}: UploadZoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>(value)
  const [rejectedFiles, setRejectedFiles] = useState<{ file: File; error: string }[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedReasons: any[]) => {
      if (disabled) return

      // 处理被拒绝的文件
      const rejected = rejectedReasons.map(({ file, errors }) => ({
        file,
        error: errors[0]?.message || 'Invalid file',
      }))
      setRejectedFiles(rejected)

      // 处理接受的文件
      const filesWithPreview = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          id: Math.random().toString(36).substr(2, 9),
        }),
      ) as FileWithPreview[]

      const newFiles = multiple ? [...files, ...filesWithPreview] : filesWithPreview
      setFiles(newFiles)
      onChange?.(newFiles)

      // 触发上传
      if (filesWithPreview.length > 0) {
        onUpload(filesWithPreview)
      }
    },
    [files, multiple, disabled, onUpload, onChange],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple,
    disabled,
  })

  const removeFile = (fileId: string) => {
    const newFiles = files.filter((f) => f.id !== fileId)
    setFiles(newFiles)
    onChange?.(newFiles)
  }

  const clearAll = () => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
    setRejectedFiles([])
    onChange?.([])
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* 上传区域 */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
          'hover:border-cyber-cyan hover:bg-cyber-cyan/5',
          isDragActive && 'border-cyber-cyan bg-cyber-cyan/10',
          isDragReject && 'border-cyber-pink bg-cyber-pink/10',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <input {...getInputProps()} />
        <Upload
          className={cn(
            'w-12 h-12 mx-auto mb-4 transition-colors',
            isDragActive ? 'text-cyber-cyan' : 'text-gray-500',
            isDragReject && 'text-cyber-pink',
          )}
        />
        {isDragActive ? (
          <p className="text-cyber-cyan">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-300 mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Max {maxFiles} file{maxFiles > 1 ? 's' : ''}, {formatFileSize(maxSize)} each
            </p>
          </div>
        )}
      </div>

      {/* 被拒绝的文件 */}
      {rejectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-cyber-pink font-semibold">Rejected files:</p>
          {rejectedFiles.map(({ file, error }, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-cyber-pink/10 border border-cyber-pink rounded"
            >
              <div className="flex items-center space-x-2">
                {getFileIcon(file)}
                <div>
                  <p className="text-sm text-gray-300">{file.name}</p>
                  <p className="text-xs text-cyber-pink">{error}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 文件预览 */}
      {showPreviews && files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </p>
            <button
              onClick={clearAll}
              className="text-xs text-cyber-pink hover:text-cyber-pink/80 transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id || file.name}
                className="flex items-center justify-between p-3 bg-cyber-card border border-cyber-border rounded-lg hover:border-cyber-cyan transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                      onLoad={() => {
                        URL.revokeObjectURL(file.preview!)
                      }}
                    />
                  ) : (
                    <div className="text-cyber-cyan">{getFileIcon(file)}</div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-200">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id!)}
                  className="p-2 text-cyber-pink hover:text-cyber-pink/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 带进度的上传组件
interface UploadProgress {
  file: FileWithPreview
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
}

interface UploadZoneWithProgressProps extends Omit<UploadZoneProps, 'value' | 'onChange'> {
  onUploadProgress?: (progress: UploadProgress[]) => void
}

export function UploadZoneWithProgress({
  onUpload,
  onUploadProgress,
  ...rest
}: UploadZoneWithProgressProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([])

  const handleUpload = async (files: File[]) => {
    const newUploads: UploadProgress[] = files.map((file) => ({
      file: file as FileWithPreview,
      progress: 0,
      status: 'uploading' as const,
    }))

    setUploads((prev) => [...prev, ...newUploads])
    onUploadProgress?.(uploads)

    // 模拟上传进度
    for (const upload of newUploads) {
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setUploads((prev) =>
          prev.map((u) =>
            u.file === upload.file ? { ...u, progress } : u,
          ),
        )
      }

      // 完成上传
      setUploads((prev) =>
        prev.map((u) =>
          u.file === upload.file ? { ...u, progress: 100, status: 'success' as const } : u,
        ),
      )
    }

    // 调用实际的上传函数
    await onUpload(files)
  }

  const removeUpload = (fileId: string) => {
    setUploads((prev) => prev.filter((u) => u.file.id !== fileId))
  }

  return (
    <div className="space-y-4">
      <UploadZone onUpload={handleUpload} {...rest} />

      {/* 上传进度 */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload) => (
            <div
              key={upload.file.id || upload.file.name}
              className="p-3 bg-cyber-card border border-cyber-border rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-200">{upload.file.name}</span>
                <button
                  onClick={() => removeUpload(upload.file.id!)}
                  className="text-cyber-pink hover:text-cyber-pink/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 进度条 */}
              <div className="relative h-2 bg-cyber-darker rounded-full overflow-hidden">
                <div
                  className={cn(
                    'absolute top-0 left-0 h-full transition-all duration-300',
                    upload.status === 'success' && 'bg-cyber-green',
                    upload.status === 'error' && 'bg-cyber-pink',
                    upload.status === 'uploading' && 'bg-cyber-cyan',
                  )}
                  style={{ width: `${upload.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">{upload.progress}%</span>
                <span
                  className={cn(
                    'text-xs',
                    upload.status === 'success' && 'text-cyber-green',
                    upload.status === 'error' && 'text-cyber-pink',
                    upload.status === 'uploading' && 'text-cyber-cyan',
                  )}
                >
                  {upload.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
